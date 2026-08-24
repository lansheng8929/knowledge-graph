"""graph 查询工具：注册 + 四工具 handler（摘要化 / 鉴权 / 错误兜底）。"""

import asyncio
import json

import httpx
import pytest

from app.models import ToolCall
from app.tools import graph
from app.tools.graph import register_graph_tools
from app.tools.registry import ToolRegistry


def _run(coro):
    return asyncio.run(coro)


def _reg():
    reg = ToolRegistry()
    register_graph_tools(reg)
    return reg


def _mock(monkeypatch, handler):
    monkeypatch.setattr(graph, "_transport", httpx.MockTransport(handler))


def _call(name, **args):
    return ToolCall(id="c1", name=name, arguments=args)


def test_register_graph_tools():
    names = [t.name for t in _reg().list()]
    assert names == ["analyze_node", "expand_graph", "graph_jump_link", "search_nodes"]


def test_search_summary(monkeypatch):
    def handler(request):
        assert request.url.path.endswith("/graph/search")
        return httpx.Response(
            200,
            json={
                "success": True,
                "data": {
                    "nodes": [
                        {"id": "n1", "data": {"label": "张三", "nodeType": "person"}},
                        {"id": "n2", "data": {"label": "李四", "nodeType": "person"}},
                    ]
                },
            },
        )

    _mock(monkeypatch, handler)
    result = _run(_reg().execute(_call("search_nodes", query="张", limit=5), {"uid": "u1"}))
    assert result.ok
    assert "搜索到 2 个节点" in result.summary
    assert "张三" in result.summary


def test_expand_sends_bearer_jwt(monkeypatch):
    captured = {}

    def handler(request):
        captured["headers"] = request.headers
        captured["payload"] = json.loads(request.content)
        return httpx.Response(
            200, json={"success": True, "data": {"nodes": [], "links": [], "total": 3}}
        )

    _mock(monkeypatch, handler)
    subject = {"uid": "u1", "username": "张三", "tenantId": "default", "clearance": 3}
    result = _run(_reg().execute(_call("expand_graph", sourceNodeId="n1"), subject))
    assert result.ok
    assert "拓出 0 个节点 / 0 条关系（命中 3）" in result.summary
    assert captured["payload"]["sourceNodeId"] == "n1"
    assert str(captured["headers"].get("authorization", "")).startswith("Bearer ")


def test_analyze_summary(monkeypatch):
    def handler(request):
        return httpx.Response(
            200,
            json={
                "success": True,
                "data": {
                    "type": "call_circle",
                    "items": [{"id": "n2", "label": "李四", "relation": "CALLED", "count": 5}],
                },
            },
        )

    _mock(monkeypatch, handler)
    result = _run(_reg().execute(_call("analyze_node", nodeIds=["n1"]), {"uid": "u1"}))
    assert result.ok
    assert "通话圈 1 个联系" in result.summary
    assert "李四(CALLED×5)" in result.summary


def test_tool_http_error_ok_false(monkeypatch):
    def handler(request):
        return httpx.Response(400, json={"detail": "No valid conditions"})

    _mock(monkeypatch, handler)
    result = _run(_reg().execute(_call("expand_graph", sourceNodeId="n1"), {"uid": "u1"}))
    assert not result.ok
    assert "No valid conditions" in result.summary


def test_unknown_tool(monkeypatch):
    _mock(monkeypatch, lambda request: httpx.Response(200, json={"success": True, "data": {}}))
    result = _run(_reg().execute(_call("no_such_tool", x=1), {"uid": "u1"}))
    assert not result.ok
    assert "未知工具" in result.summary


def test_jump_link_default_label():
    result = _run(_reg().execute(_call("graph_jump_link", nodeIds=["n1", "device-617"]), {"uid": "u1"}))
    assert result.ok
    assert "[在画布中打开图谱](/graph?ids=n1,device-617)" in result.summary


def test_jump_link_custom_label():
    result = _run(_reg().execute(_call("graph_jump_link", nodeIds=["n1"], label="查看张三"), {"uid": "u1"}))
    assert result.ok
    assert "[查看张三](/graph?ids=n1)" in result.summary


def test_jump_link_encodes_ids():
    result = _run(_reg().execute(_call("graph_jump_link", nodeIds=["n 1", "王五"]), {"uid": "u1"}))
    assert result.ok
    assert "/graph?ids=n%201,%E7%8E%8B%E4%BA%94" in result.summary


def test_jump_link_empty_ids_error():
    result = _run(_reg().execute(_call("graph_jump_link", nodeIds=[]), {"uid": "u1"}))
    assert not result.ok
    assert "nodeIds 为空" in result.summary
