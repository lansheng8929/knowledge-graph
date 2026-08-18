"""agent-service 应用装配（P0 脚手架 + P1 chat SSE 端点）。

路由：
  /health /healthz                        健康检查（含版本与 LLM provider）
  GET  /api/v1/agent/tools                工具注册表清单（P1 填充）
  POST /api/v1/agent/chat                 SSE 对话（P1 已实现，事件协议见 docs/agent-plan.md §4）
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from .chat import gen
from .config import (
    DEFAULT_CORS_ORIGINS,
    SERVICE_NAME,
    SERVICE_VERSION,
    get_env,
    get_env_list,
)
from .tools.registry import registry


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
        return StreamingResponse(
            gen(request),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
        )

    return app


app = create_app()
