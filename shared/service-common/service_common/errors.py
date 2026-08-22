"""统一异常出口：未知异常 → 后端打堆栈日志 + 前端友好提示。"""

from __future__ import annotations

import logging

FRIENDLY_DEFAULT = "服务器内部错误，请稍后重试"


def register_exception_handler(app, friendly: str = FRIENDLY_DEFAULT) -> None:
    """注册全局未知异常处理器：打堆栈日志，返回友好 500。"""
    from fastapi import Request
    from fastapi.responses import JSONResponse

    @app.exception_handler(Exception)
    async def _unhandled(request: Request, exc: Exception) -> JSONResponse:
        logging.getLogger(__name__).exception(
            "未处理异常 %s %s", request.method, request.url.path
        )
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": friendly},
        )
