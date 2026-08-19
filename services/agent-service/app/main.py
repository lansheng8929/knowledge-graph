"""agent-service 应用装配（P0 脚手架 + P1 chat SSE 端点 + P2-A 会话接口）。

路由：
  /health /healthz                        健康检查（含版本与 LLM provider）
  GET  /api/v1/agent/tools                工具注册表清单（P1 填充）
  POST /api/v1/agent/chat                 SSE 对话（P2-A：服务端生成/校验 session_id + 落库）
  GET  /api/v1/agent/sessions             会话列表（P2-A，按 X-User-Context 归属）
  GET  /api/v1/agent/sessions/{id}/messages  历史消息（before_seq 游标分页）
  DELETE /api/v1/agent/sessions/{id}      删除会话（归属校验）
"""

from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

import json

from .chat import _subject_from_request, gen
from .config import (
    DEFAULT_CORS_ORIGINS,
    PG_DSN,
    SERVICE_NAME,
    SERVICE_VERSION,
    get_env,
    get_env_list,
)
from .models import ChatRequest
from .session_store import create_session_store
from .tools.registry import registry

STREAM_HEADERS = {"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}


def _owner_of(request: Request) -> str:
    """从 X-User-Context（网关注入，可信）解析会话属主（防伪造）。"""
    subject = _subject_from_request(request)
    return str(subject.get("uid") or subject.get("username") or "")


def create_app() -> FastAPI:
    app = FastAPI(
        title="Knowledge Graph Agent Service",
        version=SERVICE_VERSION,
    )

    # CORS：开发白名单（生产由网关统一出口）
    origins = get_env_list("CORS_ALLOW_ORIGINS", DEFAULT_CORS_ORIGINS)
    if origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=list(origins),
            allow_methods=["*"],
            allow_headers=["*"],
        )

    @app.get("/health")
    @app.get("/healthz")
    def health() -> dict:
        return {
            "service": SERVICE_NAME,
            "version": SERVICE_VERSION,
            "llm_provider": get_env("LLM_PROVIDER", "mock"),
        }

    @app.get("/api/v1/agent/tools")
    def list_tools(request: Request) -> dict:
        return {"success": True, "data": registry.specs()}

    @app.post("/api/v1/agent/chat")
    async def chat(request: Request) -> StreamingResponse:

        try:
            req = ChatRequest(**await request.json())
        except Exception as exc:
            frames = (
                f"event: error\ndata: {json.dumps({'message': f'请求解析失败: {exc}'}, ensure_ascii=False)}\n\n"
                "event: done\ndata: {}\n\n"
            )
            return StreamingResponse(
                iter([frames]), media_type="text/event-stream", headers=STREAM_HEADERS
            )
        return StreamingResponse(
            gen(req, request),
            media_type="text/event-stream",
            headers=STREAM_HEADERS,
        )

    @app.get("/api/v1/agent/sessions")
    async def list_sessions(
        request: Request,
        limit: int = Query(50, ge=1, le=200),
    ) -> dict:
        store = create_session_store(PG_DSN)
        return {
            "success": True,
            "data": store.list_sessions(_owner_of(request), limit=limit),
        }

    @app.get("/api/v1/agent/sessions/{session_id}/messages")
    async def get_session_messages(
        session_id: str,
        request: Request,
        before_seq: int | None = Query(None, ge=1),
        limit: int = Query(50, ge=1, le=200),
    ) -> dict:
        owner = _owner_of(request)
        store = create_session_store(PG_DSN)
        if store.get(session_id, owner) is None:
            return {"success": False, "error": "session_not_found"}
        data = store.get_messages(session_id, owner, before_seq=before_seq, limit=limit)
        return {"success": True, "data": data}

    @app.delete("/api/v1/agent/sessions/{session_id}")
    async def delete_session(session_id: str, request: Request) -> dict:
        owner = _owner_of(request)
        store = create_session_store(PG_DSN)
        if not store.delete(session_id, owner):
            return {"success": False, "error": "session_not_found"}
        return {"success": True}

    return app


app = create_app()
