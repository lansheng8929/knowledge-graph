"""工具注册表：注册 / 元数据 / 执行兜底。"""

import asyncio

import pytest

from app.models import ToolCall, ToolResult, ToolSpec
from app.tools.registry import ToolRegistry


async def _ok_handler(call: ToolCall, subject: dict) -> ToolResult:
    return ToolResult(tool_call_id=call.id, ok=True, summary=f"ok:{call.arguments}")


async def _fail_handler(call: ToolCall, subject: dict) -> ToolResult:
    raise RuntimeError("boom")


def _run(coro):
    return asyncio.run(coro)


def test_register_and_specs():
    reg = ToolRegistry()
    reg.register(ToolSpec(name="search_nodes", description="d", parameters={}), _ok_handler)
    specs = reg.specs()
    assert specs[0]["name"] == "search_nodes"
    assert "handler" not in specs[0]  # 元数据不含实现


def test_duplicate_register_raises():
    reg = ToolRegistry()
    reg.register(ToolSpec(name="s", description="d"), _ok_handler)
    with pytest.raises(ValueError):
        reg.register(ToolSpec(name="s", description="d2"), _ok_handler)


def test_execute_ok():
    reg = ToolRegistry()
    reg.register(ToolSpec(name="s", description="d"), _ok_handler)
    r = _run(reg.execute(ToolCall(id="1", name="s", arguments={"q": 1}), {"uid": "u"}))
    assert r.ok
    assert r.summary == "ok:{'q': 1}"


def test_execute_unknown_tool():
    reg = ToolRegistry()
    r = _run(reg.execute(ToolCall(id="1", name="nope"), {}))
    assert not r.ok
    assert "未知工具" in r.summary


def test_execute_handler_error_fallback():
    reg = ToolRegistry()
    reg.register(ToolSpec(name="s", description="d"), _fail_handler)
    r = _run(reg.execute(ToolCall(id="1", name="s"), {}))
    assert not r.ok
    assert "boom" in r.summary
