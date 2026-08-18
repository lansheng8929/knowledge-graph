"""SSE 对话端点：组装器（请求/配置/注册表 → run_agent → SSE 帧）。

职责：
- 解析 ChatRequest（message / context / session_id）
- 从 X-User-Context（网关注入，可信）解析用户主体，覆写 context.subject（防伪造）
- 装配 llm（get_llm 工厂）与 tools（注册表单例）后调用 run_agent
- 序列化 SSE 帧；正常路径的 done 由 run_agent 发射（携带 messages），
  仅请求解析失败 / run_agent 抛异常时本模块补发 error + done
"""

import json

from fastapi import Request

from .agent import run_agent
from .llm import get_llm
from .models import ChatContext, ChatRequest
from .tools.registry import registry


def _subject_from_request(request: Request) -> dict:
    """解析用户主体：X-User-Context（网关 auth_request 注入，可信）。

    缺失/非法 → 空主体（P1：dev 直连无网关时无身份，工具调用由目标服务裁决）。
    """
    raw = request.headers.get("X-User-Context", "")
    if raw:
        try:
            data = json.loads(raw)
            if isinstance(data, dict):
                return data
        except json.JSONDecodeError:
            pass
    return {}


async def gen(request: Request):
    try:
        req = ChatRequest(**await request.json())
    except Exception as exc:
        yield f"event: error\ndata: {json.dumps({'message': f'请求解析失败: {exc}'}, ensure_ascii=False)}\n\n"
        yield "event: done\ndata: {}\n\n"
        return

    ctx = req.context or ChatContext()
    ctx.subject = _subject_from_request(request)

    llm = get_llm()

    try:
        async for ev in run_agent(
            message=req.message,
            context=ctx,
            session_id=req.session_id,
            llm=llm,
            tools=registry,
        ):
            if await request.is_disconnected():
                break
            yield f"event: {ev.event}\ndata: {json.dumps(ev.data, ensure_ascii=False)}\n\n"
    except Exception as e:
        yield f"event: error\ndata: {json.dumps({'message': str(e)}, ensure_ascii=False)}\n\n"
        yield "event: done\ndata: {}\n\n"
