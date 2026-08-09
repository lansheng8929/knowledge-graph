"""graph-query-service 应用装配。

路由（契约版本化，T1.1.2）：
  /api/v1/graph/init|search|expand|analyze   ← 新契约
  /api/graph/*                                ← 旧路由兼容（Strangler，可由 ENABLE_LEGACY_ROUTES 关闭）
  /health  /healthz                           ← 健康检查（T1.1.6）

统一响应信封：{ success: bool, data: ... }（与现状兼容）。
"""

import json
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from neo4j import GraphDatabase
from neo4j import exceptions as neo4j_exc
from starlette.middleware.base import BaseHTTPMiddleware

from . import metrics
from . import models as m
from . import queries as q
from .config import settings
from .observability import audit, init_tracing, instrument_fastapi, setup_logging
from .pep import get_pep, subject_from_request
from .rule_client import RuleServiceClient, RuleServiceUnavailable

# T2.1.4：Rule Service 客户端（RULE_SERVICE_URL 为空则禁用规则校验）
_rule_client = (
    RuleServiceClient(settings.rule_service_url) if settings.rule_service_url else None
)

# 启动时创建的索引（与旧服务一致）
_INDEX_SPECS = [
    ("person", "id"), ("person", "label"),
    ("phone", "id"), ("phone", "label"),
    ("address", "id"), ("account", "id"),
    ("company", "id"), ("ip", "id"), ("device", "id"),
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    driver = GraphDatabase.driver(
        settings.neo4j_uri,
        auth=(settings.neo4j_user, settings.neo4j_password),
        max_connection_pool_size=settings.max_pool_size,
        connection_acquisition_timeout=settings.connection_acquisition_timeout,
        connection_timeout=settings.connection_timeout,
    )
    app.state.driver = driver

    # 预热 + 建索引（任何失败不阻断启动，交由 /healthz 暴露问题）
    try:
        with driver.session() as session:
            session.run("RETURN 1")
            for label, key in _INDEX_SPECS:
                session.run(
                    f"CREATE INDEX IF NOT EXISTS FOR (n:{label}) ON (n.{key})"
                )
        print("[warmup] Neo4j connected, indexes ready")
    except Exception as e:  # noqa: BLE001
        print(f"[warmup] Neo4j not ready yet: {e}")

    yield
    driver.close()


def create_app() -> FastAPI:
    app = FastAPI(
        title="Knowledge Graph Query Service",
        version=settings.service_version,
        lifespan=lifespan,
    )

    # 可观测（T2.4）：结构化日志 + OTel Trace（未配置 collector 时静默跳过）
    setup_logging()
    if init_tracing(settings.service_name):
        instrument_fastapi(app)

    # CORS：开发白名单（生产由网关统一出口）
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

    # ── Neo4j 异常 → 统一语义化错误码（T1.1.5）────────

    async def _neo4j_error_handler(_request: Request, exc: Exception) -> JSONResponse:
        if isinstance(exc, neo4j_exc.AuthError):
            code, msg = 503, "neo4j authentication failed"
        elif isinstance(exc, neo4j_exc.ServiceUnavailable):
            code, msg = 503, "neo4j unavailable"
        elif isinstance(exc, neo4j_exc.ClientError):
            code, msg = 400, str(exc)
        else:
            code, msg = 500, str(exc)
        return JSONResponse(
            status_code=code,
            content={"success": False, "error": msg},
        )

    for exc_type in (neo4j_exc.AuthError, neo4j_exc.ServiceUnavailable, neo4j_exc.ClientError):
        app.add_exception_handler(exc_type, _neo4j_error_handler)

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

    # ── handlers ───────────────────────────────────────

    def _l2_check(subject: dict, action: str) -> None:
        """L2 服务级授权（T4.5，可选）：ENABLE_PEP 开启且 pep-client 可用时执行。"""
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

    def init_graph(req: m.InitRequest, request: Request) -> dict:
        driver = request.app.state.driver
        subject = subject_from_request(request)
        _l2_check(subject, "init")
        data = q.query_init(driver, req.ids, subject)
        return {"success": True, "data": data}

    def search_nodes(req: m.SearchRequest, request: Request) -> dict:
        driver = request.app.state.driver
        subject = subject_from_request(request)
        _l2_check(subject, "search")
        data = q.query_search(driver, req.query, req.limit, subject)
        return {"success": True, "data": data}

    def expand_graph(req: m.ExpandRequest, request: Request) -> dict:
        driver = request.app.state.driver
        subject = subject_from_request(request)
        _l2_check(subject, "expand")
        if not req.conditions:
            raise HTTPException(status_code=400, detail="No conditions provided")

        # T2.1.4：真实规则 id 时经 Rule Service 做值级白名单校验。
        # 渐进接入：ruleId 为 __custom__/空（旧前端自由组合）或 Rule Service 不可达时，
        # 回退到本地 validator（queries.query_expand 内 lenient 校验），不破坏现有 dev。
        if _rule_client is not None and req.ruleId and req.ruleId != "__custom__":
            try:
                vr = _rule_client.validate(req.ruleId, req.conditions)
                if not vr.valid:
                    detail = "; ".join(vr.errors) or "conditions rejected by rule"
                    raise HTTPException(status_code=400, detail=detail)
            except RuleServiceUnavailable as e:
                print(f"[rule-client] rule service unavailable, fallback to local: {e}")

        try:
            data = q.query_expand(driver, req, subject)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid conditions JSON")
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        audit(
            subject=subject.get("uid", "unknown"),
            resource=req.ruleId or "__custom__",
            action="expand",
            decision="allow",
        )
        return {"success": True, "data": data}

    def analyze_node(req: m.AnalysisRequest, request: Request) -> dict:
        driver = request.app.state.driver
        subject = subject_from_request(request)
        _l2_check(subject, "analyze")
        data = q.query_analyze(driver, req)
        return {"success": True, "data": data}

    # ── 路由注册：新契约 + 旧路由兼容 ─────────────────

    # body 模型由 handler 参数类型注解推断（req: m.XXXRequest）
    _routes = [
        ("init", init_graph, m.Envelope[m.InitData]),
        ("search", search_nodes, m.Envelope[m.SearchData]),
        ("expand", expand_graph, m.Envelope[m.PageResult]),
        ("analyze", analyze_node, m.Envelope[m.AnalyzeData]),
    ]
    for name, handler, resp_model in _routes:
        app.add_api_route(
            f"/api/v1/graph/{name}",
            handler,
            methods=["POST"],
            response_model=resp_model,
        )
        if settings.enable_legacy_routes:
            app.add_api_route(
                f"/api/graph/{name}",
                handler,
                methods=["POST"],
                response_model=resp_model,
            )

    # ── 流式端点（NDJSON，方案 A：边查边发）────────────
    # 每行 JSON：meta/node/link/done。前端 ReadableStream 逐行解析 → 边收边增量渲染。

    def _ndjson(gen):
        for row in gen:
            yield json.dumps(row, ensure_ascii=False) + "\n"

    def init_graph_stream(req: m.InitRequest, request: Request) -> StreamingResponse:
        driver = request.app.state.driver
        subject = subject_from_request(request)
        _l2_check(subject, "init")
        return StreamingResponse(
            _ndjson(q.query_init_stream(driver, req.ids, subject)),
            media_type="application/x-ndjson",
        )

    def expand_graph_stream(req: m.ExpandRequest, request: Request) -> StreamingResponse:
        driver = request.app.state.driver
        subject = subject_from_request(request)
        _l2_check(subject, "expand")
        # T2.1.4：规则白名单校验（同非流式）
        if _rule_client is not None and req.ruleId and req.ruleId != "__custom__":
            try:
                vr = _rule_client.validate(req.ruleId, req.conditions)
                if not vr.valid:
                    detail = "; ".join(vr.errors) or "conditions rejected by rule"
                    raise HTTPException(status_code=400, detail=detail)
            except RuleServiceUnavailable as e:
                print(f"[rule-client] rule service unavailable, fallback to local: {e}")

        def gen():
            try:
                for row in q.query_expand_stream(driver, req, subject):
                    yield json.dumps(row, ensure_ascii=False) + "\n"
            finally:
                audit(
                    subject=subject.get("uid", "unknown"),
                    resource=req.ruleId or "__custom__",
                    action="expand",
                    decision="allow",
                    reason="stream",
                )

        return StreamingResponse(gen(), media_type="application/x-ndjson")

    app.add_api_route("/api/v1/graph/init/stream", init_graph_stream, methods=["POST"])
    app.add_api_route("/api/v1/graph/expand/stream", expand_graph_stream, methods=["POST"])
    if settings.enable_legacy_routes:
        app.add_api_route("/api/graph/init/stream", init_graph_stream, methods=["POST"])
        app.add_api_route("/api/graph/expand/stream", expand_graph_stream, methods=["POST"])

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host=settings.host, port=settings.port)
