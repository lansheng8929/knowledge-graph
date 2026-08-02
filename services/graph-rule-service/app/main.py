"""graph-rule-service 应用装配。

路由（T2.1.3 / T2.1.2）：
  GET/POST /api/v1/rules           规则目录 CRUD
  GET/PUT/DELETE /api/v1/rules/{id}
  POST /api/v1/rules/{id}/publish  发布（状态流转）
  POST /api/v1/rules/validate      校验 conditions（前端自由 JSON → 值级白名单）
  /health /healthz
"""

import json
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from . import metrics
from . import models as m
from .config import settings
from .observability import audit, init_tracing, instrument_fastapi, setup_logging
from .pep import get_pep, subject_from_request
from .store import RuleStore, create_store
from .validator import ConditionValidationError, parse_conditions, validate_conditions


def create_app() -> FastAPI:
    store: RuleStore = create_store(settings.rule_store)

    @asynccontextmanager
    async def lifespan(_app: FastAPI):
        try:
            store.ensure_ready()
        except Exception as e:  # noqa: BLE001（PG 未就绪时不阻断启动）
            print(f"[warmup] store not ready: {e}")
        yield

    app = FastAPI(
        title="Knowledge Graph Rule Service",
        version=settings.service_version,
        lifespan=lifespan,
    )

    # 可观测（T2.4）：结构化日志 + OTel Trace（未配置 collector 时静默跳过）
    setup_logging()
    if init_tracing(settings.service_name):
        instrument_fastapi(app)

    if settings.cors_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=list(settings.cors_origins),
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # T2.4.2：Prometheus 请求指标（QPS/延迟/状态码）
    class MetricsMiddleware(BaseHTTPMiddleware):
        async def dispatch(self, request: Request, call_next):
            start = time.perf_counter()
            response = await call_next(request)
            metrics.REQUEST_TOTAL.labels(
                request.method, request.url.path, str(response.status_code)
            ).inc()
            metrics.REQUEST_LATENCY.labels(
                request.method, request.url.path
            ).observe(time.perf_counter() - start)
            return response

    app.add_middleware(MetricsMiddleware)

    # ── 健康检查 ───────────────────────────────────────

    def health() -> dict:
        return {
            "status": "ok",
            "service": settings.service_name,
            "version": settings.service_version,
        }

    app.add_api_route("/health", health, methods=["GET"])
    app.add_api_route("/healthz", health, methods=["GET"])
    app.add_api_route("/metrics", metrics.metrics_response, methods=["GET"])

    # ── 校验（须在 /{rule_id} 之前注册）────────────────

    def _l2_check(subject: dict, action: str, request: Request) -> None:
        """L2 服务级授权（T4.5.1，可选）：ENABLE_PEP 开启且 pep-client 可用时执行。"""
        pep = get_pep()
        if pep is None:
            return
        allow = pep.check(
            subject=subject,
            resource={
                "tenantId": subject.get("tenantId", "default"),
                "classification": 0,
                "owner": subject.get("uid", ""),
                "visibility": "public",
                "nodeType": "",
            },
            action=action,
        )
        if not allow:
            audit(
                subject=subject.get("uid", "unknown"),
                resource=action,
                action=action,
                decision="deny",
                reason="l2_denied",
            )
            raise HTTPException(status_code=403, detail="permission denied")

    def validate_conditions_endpoint(req: m.ValidateRequest, request: Request) -> dict:
        subject = subject_from_request(request)
        _l2_check(subject, "rule_validate", request)
        try:
            conds = parse_conditions(req.conditions)
        except json.JSONDecodeError:
            resp = m.ValidateResponse(valid=False, errors=["invalid conditions JSON"])
            return {"success": True, "data": resp.model_dump()}

        rule = req.rule
        if rule is None and req.ruleId:
            rule = store.get(req.ruleId)
        if rule is None:
            resp = m.ValidateResponse(valid=False, errors=["rule not found"])
            return {"success": True, "data": resp.model_dump()}

        try:
            result = validate_conditions(conds, rule)
        except ConditionValidationError as e:
            resp = m.ValidateResponse(valid=False, errors=[str(e)])
            return {"success": True, "data": resp.model_dump()}

        resp = m.ValidateResponse(
            valid=result.valid, normalized=result.normalized, errors=result.errors
        )
        audit(
            subject=subject.get("uid", "unknown"),
            resource=req.ruleId or "inline",
            action="validate",
            decision="allow" if result.valid else "deny",
        )
        return {"success": True, "data": resp.model_dump()}

    app.add_api_route(
        "/api/v1/rules/validate",
        validate_conditions_endpoint,
        methods=["POST"],
        response_model=m.EnvelopeRuleValidate,
    )

    # ── 规则 CRUD ──────────────────────────────────────

    def list_rules() -> dict:
        rules = [r.model_dump() for r in store.list()]
        return {"success": True, "data": {"rules": rules}}

    def create_rule(req: m.RuleCreate) -> dict:
        rule = store.create(req)
        return {"success": True, "data": rule.model_dump()}

    def get_rule(rule_id: str) -> dict:
        rule = store.get(rule_id)
        if not rule:
            raise HTTPException(status_code=404, detail="rule not found")
        return {"success": True, "data": rule.model_dump()}

    def update_rule(rule_id: str, req: m.RuleCreate) -> dict:
        rule = store.update(rule_id, req)
        if not rule:
            raise HTTPException(status_code=404, detail="rule not found")
        return {"success": True, "data": rule.model_dump()}

    def publish_rule(rule_id: str) -> dict:
        rule = store.set_status(rule_id, m.RuleStatus.PUBLISHED)
        if not rule:
            raise HTTPException(status_code=404, detail="rule not found")
        return {"success": True, "data": rule.model_dump()}

    def delete_rule(rule_id: str) -> dict:
        if not store.delete(rule_id):
            raise HTTPException(status_code=404, detail="rule not found")
        return {"success": True, "data": {"deleted": rule_id}}

    app.add_api_route("/api/v1/rules", list_rules, methods=["GET"])
    app.add_api_route("/api/v1/rules", create_rule, methods=["POST"], response_model=m.EnvelopeRule)
    app.add_api_route(
        "/api/v1/rules/{rule_id}", get_rule, methods=["GET"], response_model=m.EnvelopeRule
    )
    app.add_api_route(
        "/api/v1/rules/{rule_id}", update_rule, methods=["PUT"], response_model=m.EnvelopeRule
    )
    app.add_api_route(
        "/api/v1/rules/{rule_id}/publish",
        publish_rule,
        methods=["POST"],
        response_model=m.EnvelopeRule,
    )
    app.add_api_route(
        "/api/v1/rules/{rule_id}", delete_rule, methods=["DELETE"]
    )

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host=settings.host, port=settings.port)
