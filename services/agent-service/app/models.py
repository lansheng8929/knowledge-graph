"""请求/响应与 LLM 消息模型（P0 契约基础，详见 docs/agent-plan.md §4 / §11）。"""

from typing import Any

from pydantic import BaseModel, Field


# ── 对话请求 ────────────────────────────────────────────


class ChatContext(BaseModel):
    """对话上下文。

    graph_ids：前端传当前画布/选中节点 ids（P1 预留，供「针对当前视图提问」）。
    subject：服务端注入的当前用户主体 —— chat.py 从 X-User-Context/JWT 解析后
    覆写，客户端传值一律被覆盖（防伪造），供工具调用鉴权。
    """

    graph_ids: list[str] = Field(default_factory=list)
    subject: dict[str, Any] | None = None


class ChatRequest(BaseModel):
    session_id: str | None = None
    message: str = Field(..., min_length=1, max_length=4000)
    context: ChatContext | None = None


# ── 工具契约（function calling 用）──────────────────────


class ToolCall(BaseModel):
    id: str
    name: str
    arguments: dict[str, Any] = Field(default_factory=dict)


class ToolSpec(BaseModel):
    """工具定义（LLM function calling 的 JSON Schema 形态，不含实现）。"""

    name: str
    description: str
    parameters: dict[str, Any] = Field(default_factory=dict)  # JSON Schema


class ToolResult(BaseModel):
    """工具执行结果（摘要化输出回填给 LLM）。"""

    tool_call_id: str
    ok: bool = True
    summary: str = ""
    payload: dict[str, Any] | None = None


# ── LLM 消息 ─────────────────────────────────────────────


class LLMMessage(BaseModel):
    role: str  # system | user | assistant | tool
    content: str = ""
    tool_calls: list[ToolCall] = Field(default_factory=list)
    tool_call_id: str | None = None

    @classmethod
    def system(cls, text: str) -> "LLMMessage":
        """系统提示消息（角色 + 安全约束）。"""
        return cls(role="system", content=text)

    @classmethod
    def user(cls, text: str) -> "LLMMessage":
        """用户消息。"""
        return cls(role="user", content=text)

    @classmethod
    def assistant(
        cls, text: str = "", tool_calls: list[ToolCall] | None = None
    ) -> "LLMMessage":
        """assistant 消息：普通回答（text）或携带工具调用（tool_calls）。"""
        return cls(role="assistant", content=text, tool_calls=tool_calls or [])

    @classmethod
    def tool(cls, tool_call_id: str, content: str) -> "LLMMessage":
        """工具执行结果消息：按 tool_call_id 对应 LLM 发起的调用。"""
        return cls(role="tool", tool_call_id=tool_call_id, content=content)


# ── SSE 事件（对话流式协议）─────────────────────────────


class SseEvent(BaseModel):
    event: str  # delta | tool | graph | confirm | done | error
    data: dict[str, Any] = Field(default_factory=dict)
