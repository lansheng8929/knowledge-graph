"""SSE 对话端点：组装器（请求/配置/注册表 → run_agent → SSE 帧）。"""

import json
import logging

from fastapi import Request

from .agent import run_agent
from .config import PG_DSN
from .llm import get_llm
from .models import ChatContext, ChatRequest
from .session_store import create_session_store
from .tools.registry import registry

logger = logging.getLogger(__name__)


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


def _persist_turn(
    store, session_id: str, owner: str, done_data: dict, is_new: bool
) -> None:
    """done 时把本轮消息落库（跳过 system；新会话首轮 user 已由 create 写入，避免重复）。"""
    msgs = done_data.get("messages") or []
    append = [
        m
        for m in msgs
        if m.get("role") != "system" and not (is_new and m.get("role") == "user")
    ]
    if append:
        store.append_turn(session_id, owner, append)


async def gen(req: ChatRequest, request: Request):
    ctx = req.context or ChatContext()
    ctx.subject = _subject_from_request(request)
    owner = str(ctx.subject.get("uid") or ctx.subject.get("username") or "")

    try:
        llm = get_llm()
        ok, detail = await llm.ping()
        if not ok:
            yield f"event: error\ndata: {json.dumps({'message': f'LLM 服务检查失败: {detail}'}, ensure_ascii=False)}\n\n"
            yield "event: done\ndata: {}\n\n"
            return
    except Exception as e:
        logger.exception("LLM 初始化失败: %s", e)
        yield f"event: error\ndata: {json.dumps({'message': f'LLM 初始化失败: {e}'}, ensure_ascii=False)}\n\n"
        yield "event: done\ndata: {}\n\n"
        return

    store = create_session_store(PG_DSN)

    try:
        if req.session_id:
            if store.get(req.session_id, owner) is None:
                yield 'event: error\ndata: {"message": "session_not_found"}\n\n'
                yield "event: done\ndata: {}\n\n"
                return
            session_id = req.session_id
            is_new_session = False
        else:
            conv = store.create(owner, req.message)
            session_id = conv["id"]
            is_new_session = True
    except Exception as e:
        logger.exception("会话初始化失败: %s", e)
        yield f"event: error\ndata: {json.dumps({'message': f'会话初始化失败: {e}'}, ensure_ascii=False)}\n\n"
        yield "event: done\ndata: {}\n\n"
        return

    try:
        async for ev in run_agent(
            message=req.message,
            context=ctx,
            session_id=session_id,
            llm=llm,
            tools=registry,
        ):
            if ev.event == "done":
                _persist_turn(store, session_id, owner, ev.data, is_new_session)
                ev.data["session_id"] = session_id
            yield f"event: {ev.event}\ndata: {json.dumps(ev.data, ensure_ascii=False)}\n\n"
    except Exception as e:
        logger.exception("chat 流处理异常: %s", e)
        yield 'event: error\ndata: {"message": "服务器开小差了，请稍后重试"}\n\n'
        yield "event: done\ndata: {}\n\n"
