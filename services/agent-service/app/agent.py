"""Agent 工具循环（P1 实现；本模块内置全部常量，不注入参数）。

参数契约（定稿，docs/agent-plan.md §11.1）：
  run_agent(*, message, context, session_id, llm, tools)
  - message:    用户本轮消息（chat.py 从请求体取）
  - context:    对话上下文（graph_ids + 服务端注入 subject，供工具鉴权）
  - session_id: 会话标识（P1 透传可空，P3 持久化）
  - llm:        LLM 客户端（get_llm() 工厂按 LLM_PROVIDER 创建）
  - tools:      工具注册表实例（specs() 给 LLM 元数据；execute() 执行并兜底）

事件协议：本函数产出内容事件（tool start/done|error → delta*），并**以 done 事件
收尾**——done 携带 session_id 与完整消息历史 messages（P3 会话持久化用，
前端忽略 messages 字段即可）。异常路径下 done 由 chat.py 补发。
环境变量一律经 config.get_env* 直接读取（§11.2）。
"""

from __future__ import annotations

from collections.abc import Iterator
from typing import Any, AsyncIterator

from .config import get_env_int
from .llm import LLMClient
from .models import ChatContext, LLMMessage, SseEvent
from .tools.registry import ToolRegistry

# ── 内置常量（§11.3）────────────────────────────────────

SYSTEM_PROMPT = (
    "你是知识图谱查询助手。只能基于工具调用返回的事实回答，不编造节点或关系；"
    "工具结果为空时如实说明；密级与可见性以工具结果为准；使用中文回答。"
)

MAX_TOOL_TURNS = get_env_int("MAX_TOOL_TURNS", 8)  # 单轮对话最大工具轮数
MAX_OUTPUT_TOKENS = get_env_int("MAX_OUTPUT_TOKENS", 2048)  # 最终文本裁剪
DELTA_CHUNK = 64  # delta 分块大小（字符）


def _delta_events(text: str) -> Iterator[SseEvent]:
    """把整段回答按 DELTA_CHUNK 切成多个 delta 事件，模拟流式增量。"""
    for i in range(0, len(text), DELTA_CHUNK):
        yield SseEvent(event="delta", data={"text": text[i : i + DELTA_CHUNK]})


def _done_event(session_id: str | None, messages: list[LLMMessage]) -> SseEvent:
    """终止事件：session_id + 完整消息历史（P3 会话持久化用）。"""
    return SseEvent(
        event="done",
        data={
            "session_id": session_id or "",
            "messages": [m.model_dump() for m in messages],
        },
    )


async def run_agent(
    *,
    message: str,
    context: ChatContext | None,
    session_id: str | None,
    llm: LLMClient,
    tools: ToolRegistry,
) -> AsyncIterator[SseEvent]:

    subject: dict[str, Any] = context.subject if context and context.subject else {}
    messages: list[LLMMessage] = [
        LLMMessage.system(SYSTEM_PROMPT),
        LLMMessage.user(message),
    ]

    for turn in range(MAX_TOOL_TURNS):
        reply: LLMMessage = await llm.chat(messages, tools=tools.specs())

        if not reply.tool_calls:
            messages.append(LLMMessage.assistant(reply.content[:MAX_OUTPUT_TOKENS]))
            for ev in _delta_events(reply.content[:MAX_OUTPUT_TOKENS]):
                yield ev
            yield _done_event(session_id, messages)
            return

        messages.append(reply)
        for call in reply.tool_calls:
            yield SseEvent(
                event="tool",
                data={
                    "name": call.name,
                    "status": "start",
                    "args": call.arguments,
                },
            )

            result = await tools.execute(call, subject)

            yield SseEvent(
                event="tool",
                data={
                    "name": call.name,
                    "status": "done" if result.ok else "error",
                    "summary": result.summary,
                },
            )

            messages.append(LLMMessage.tool(call.id, result.summary))

    yield SseEvent(
        event="error",
        data={"message": f"超过最大工具轮数（{MAX_TOOL_TURNS}）"},
    )
    yield _done_event(session_id, messages)
