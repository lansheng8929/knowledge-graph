"""business-core-service 应用装配（通用业务能力：审批/任务/报表/审计）。

路由前缀：
  /api/v1/approval/*  审批流
  /api/v1/tasks/*     任务分派
  /api/v1/reports/*   报表聚合
  /api/v1/audit/*     审计责任
主体一律来自 X-User-Context（uid/tenantId/orgPath/subUids/teams/managerUid）。
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from . import approval, audit as audit_mod, reports, tasks as task_mod
from .config import settings
from .store import create_store
from .subject import subject_from_request

store = create_store(settings.store_kind, settings.pg_dsn)


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


# ── 请求模型 ──────────────────────────────────────────


class ApprovalCreate(BaseModel):
    type: str = "default"
    objectType: str = ""
    objectId: str = ""
    payload: Dict[str, Any] = Field(default_factory=dict)
    approvers: List[str] = Field(default_factory=list)


class ApprovalAction(BaseModel):
    action: str
    comment: str = ""


class TaskCreate(BaseModel):
    objectType: str = ""
    objectId: str = ""
    payload: Dict[str, Any] = Field(default_factory=dict)
    assigneeUid: str = ""
    assignByOrg: str = ""
    dueAt: str = ""


class TaskStatus(BaseModel):
    status: str


class ReportCreate(BaseModel):
    name: str = ""
    dataset: str
    groupBy: str


class AuditEvent(BaseModel):
    action: str
    objectType: str = ""
    objectId: str = ""
    payload: Dict[str, Any] = Field(default_factory=dict)


def create_app() -> FastAPI:
    app = FastAPI(
        title="Business Core Service (通用业务能力组件)",
        version=settings.service_version,
        lifespan=lifespan,
    )
    if settings.cors_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=list(settings.cors_origins),
            allow_methods=["*"],
            allow_headers=["*"],
        )

    def health() -> dict:
        return {
            "status": "ok",
            "service": settings.service_name,
            "version": settings.service_version,
        }

    app.add_api_route("/health", health, methods=["GET"])
    app.add_api_route("/healthz", health, methods=["GET"])

    def _ok(data: Any) -> dict:
        return {"success": True, "data": data}

    # ── 审批流 ────────────────────────────────────────

    def approval_create(req: ApprovalCreate, request: Request) -> dict:
        try:
            return _ok(
                approval.create_request(
                    subject_from_request(request), store, req.model_dump()
                )
            )
        except approval.ApprovalError as e:
            raise HTTPException(status_code=400, detail=str(e)) from e

    def approval_list(request: Request, status: str = "") -> dict:
        return _ok(
            approval.list_for_subject(subject_from_request(request), store, status)
        )

    def approval_get(rid: str) -> dict:
        doc = store.get("approval", rid)
        if doc is None:
            raise HTTPException(status_code=404, detail=f"approval not found: {rid}")
        return _ok(doc)

    def approval_action(rid: str, req: ApprovalAction, request: Request) -> dict:
        try:
            return _ok(
                approval.act(
                    subject_from_request(request), store, rid, req.action, req.comment
                )
            )
        except approval.ApprovalError as e:
            raise HTTPException(status_code=400, detail=str(e)) from e

    app.add_api_route("/api/v1/approval/requests", approval_create, methods=["POST"])
    app.add_api_route("/api/v1/approval/requests", approval_list, methods=["GET"])
    app.add_api_route("/api/v1/approval/requests/{rid}", approval_get, methods=["GET"])
    app.add_api_route(
        "/api/v1/approval/requests/{rid}/action", approval_action, methods=["POST"]
    )

    # ── 任务分派 ──────────────────────────────────────

    def task_create(req: TaskCreate, request: Request) -> dict:
        try:
            return _ok(
                task_mod.create_task(
                    subject_from_request(request), store, req.model_dump()
                )
            )
        except task_mod.TaskError as e:
            raise HTTPException(status_code=400, detail=str(e)) from e

    def task_list(request: Request, status: str = "") -> dict:
        return _ok(task_mod.list_visible(subject_from_request(request), store, status))

    def task_status(tid: str, req: TaskStatus, request: Request) -> dict:
        try:
            return _ok(
                task_mod.set_status(
                    subject_from_request(request), store, tid, req.status
                )
            )
        except task_mod.TaskError as e:
            raise HTTPException(status_code=400, detail=str(e)) from e

    app.add_api_route("/api/v1/tasks", task_create, methods=["POST"])
    app.add_api_route("/api/v1/tasks", task_list, methods=["GET"])
    app.add_api_route("/api/v1/tasks/{tid}/status", task_status, methods=["POST"])

    # ── 报表聚合 ──────────────────────────────────────

    def report_create(req: ReportCreate, request: Request) -> dict:
        try:
            return _ok(
                reports.create_definition(
                    subject_from_request(request), store, req.model_dump()
                )
            )
        except reports.ReportError as e:
            raise HTTPException(status_code=400, detail=str(e)) from e

    def report_list(request: Request) -> dict:
        me = subject_from_request(request).get("uid")
        rows = [d for d in store.find("report_definition") if d.get("createdBy") == me]
        return _ok(rows)

    def report_run(def_id: str, request: Request) -> dict:
        try:
            return _ok(reports.run(subject_from_request(request), store, def_id))
        except reports.ReportError as e:
            raise HTTPException(status_code=400, detail=str(e)) from e

    app.add_api_route("/api/v1/reports/definitions", report_create, methods=["POST"])
    app.add_api_route("/api/v1/reports/definitions", report_list, methods=["GET"])
    app.add_api_route(
        "/api/v1/reports/definitions/{def_id}/run", report_run, methods=["POST"]
    )

    # ── 审计责任 ──────────────────────────────────────

    def audit_create(req: AuditEvent, request: Request) -> dict:
        return _ok(
            audit_mod.record(subject_from_request(request), store, req.model_dump())
        )

    def audit_list(
        request: Request,
        objectType: str = "",
        objectId: str = "",
        action: str = "",
    ) -> dict:
        filters = {"objectType": objectType, "objectId": objectId, "action": action}
        return _ok(audit_mod.search(subject_from_request(request), store, filters))

    app.add_api_route("/api/v1/audit/events", audit_create, methods=["POST"])
    app.add_api_route("/api/v1/audit/events", audit_list, methods=["GET"])

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=settings.host, port=settings.port)
