"""工具注册表（形态定稿，docs/agent-plan.md §11.4）。

每个工具 = 元数据（ToolSpec，给 LLM function calling）+ 实现（handler）。
handler 签名：async (call: ToolCall, subject: dict) -> ToolResult；
subject 为服务端注入的用户主体（context.subject），工具用它重签 JWT 调上游，
权限由目标服务既有 L2/L3/L4 保证（docs/agent-plan.md §3）。
"""

from __future__ import annotations

import logging
from typing import Awaitable, Callable

from ..models import ToolCall, ToolResult, ToolSpec

logger = logging.getLogger(__name__)

# 工具实现：绑定用户主体执行一次工具调用
ToolHandler = Callable[[ToolCall, dict], Awaitable[ToolResult]]


class ToolRegistry:
    def __init__(self) -> None:
        self._tools: dict[str, ToolSpec] = {}
        self._handlers: dict[str, ToolHandler] = {}

    def register(self, spec: ToolSpec, handler: ToolHandler) -> None:
        if spec.name in self._tools:
            raise ValueError(f"工具重复注册: {spec.name}")
        self._tools[spec.name] = spec
        self._handlers[spec.name] = handler

    def get(self, name: str) -> ToolSpec | None:
        return self._tools.get(name)

    def list(self) -> list[ToolSpec]:
        return sorted(self._tools.values(), key=lambda t: t.name)

    def specs(self) -> list[dict]:
        """LLM function calling 元数据（不含 handler）。"""
        return [t.model_dump() for t in self.list()]

    async def execute(self, call: ToolCall, subject: dict) -> ToolResult:
        """执行工具：未知工具/异常一律兜底为 ToolResult(ok=False)，
        由 agent 回填给 LLM 自我纠错，不中断对话。"""
        handler = self._handlers.get(call.name)
        if handler is None:
            return ToolResult(
                tool_call_id=call.id, ok=False, summary=f"未知工具: {call.name}"
            )
        try:
            return await handler(call, subject)
        except Exception as exc:  # noqa: BLE001
            logger.warning("工具 %s 执行失败: %s", call.name, exc)
            return ToolResult(
                tool_call_id=call.id, ok=False, summary=f"工具执行失败: {exc}"
            )


# 模块级单例：应用装配时注入工具（P1：graph 域 4 工具）
registry = ToolRegistry()
