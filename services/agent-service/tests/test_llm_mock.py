"""LLM 层：MockLLM 行为 + OpenAILLMClient 转换/解析 + get_llm 工厂（无需真实网络）。"""

import asyncio
import json

import httpx
import pytest

from app.llm import MockLLM, OpenAILLMClient, get_llm
from app.models import LLMMessage, ToolCall


def _run(coro):
    return asyncio.run(coro)


def _openai(monkeypatch, transport=None):
    monkeypatch.setenv("LLM_BASE_URL", "http://llm.test/v1")
    monkeypatch.setenv("LLM_MODEL", "test-model")
    monkeypatch.setenv("LLM_API_KEY", "k")
    return OpenAILLMClient(transport=transport)


# ── MockLLM ─────────────────────────────────────────────

def test_mock_echo():
    llm = MockLLM()
    msg = _run(llm.chat([LLMMessage(role="user", content="你好")]))
    assert msg.content == "[mock] 你好"
    assert msg.tool_calls == []


def test_mock_scripted_tool_call():
    llm = MockLLM(
        script={
            "trigger": ["查找"],
            "tool_calls": [{"name": "search_nodes", "arguments": {"query": "张三"}}],
        }
    )
    msg = _run(llm.chat([LLMMessage(role="user", content="帮我查找张三")]))
    assert msg.content == ""
    assert len(msg.tool_calls) == 1
    assert msg.tool_calls[0].name == "search_nodes"
    assert msg.tool_calls[0].arguments == {"query": "张三"}


def test_mock_no_trigger_ignores_script():
    llm = MockLLM(script={"trigger": ["查找"], "tool_calls": []})
    msg = _run(llm.chat([LLMMessage(role="user", content="最近怎么样")]))
    assert msg.content == "[mock] 最近怎么样"
    assert msg.tool_calls == []


def test_mock_tool_once_then_summarizes():
    """工具结果回填后收敛：第二次调用不再触发工具，而是汇总结果作答。"""
    script = {
        "trigger": ["查找"],
        "tool_calls": [{"name": "search_nodes", "arguments": {"query": "张三"}}],
    }
    llm = MockLLM(script=script)
    specs = [{"name": "search_nodes", "description": "d", "parameters": {}}]

    first = _run(llm.chat([LLMMessage.user("帮我查找张三")], tools=specs))
    assert len(first.tool_calls) == 1

    history = [
        LLMMessage.user("帮我查找张三"),
        LLMMessage.assistant(tool_calls=first.tool_calls),
        LLMMessage.tool(first.tool_calls[0].id, "找到 3 个节点"),
    ]
    second = _run(llm.chat(history, tools=specs))
    assert second.tool_calls == []
    assert "工具执行完成" in second.content
    assert "找到 3 个节点" in second.content


def test_mock_skips_unregistered_tool():
    """脚本引用未注册工具 → 跳过（白名单校验），回退普通回显。"""
    llm = MockLLM(
        script={"trigger": ["查找"], "tool_calls": [{"name": "ghost", "arguments": {}}]}
    )
    msg = _run(
        llm.chat(
            [LLMMessage.user("帮我查找张三")],
            tools=[{"name": "search_nodes", "description": "d"}],
        )
    )
    assert msg.tool_calls == []
    assert msg.content == "[mock] 帮我查找张三"


# ── OpenAILLMClient（httpx.MockTransport 注入）───────────

def test_openai_plain_reply(monkeypatch):
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(
            200, json={"choices": [{"message": {"role": "assistant", "content": "你好"}}]}
        )

    llm = _openai(monkeypatch, transport=httpx.MockTransport(handler))
    msg = _run(llm.chat([LLMMessage.user("hi")]))
    assert msg.content == "你好"
    assert msg.tool_calls == []


def test_openai_tool_calls_and_payload(monkeypatch):
    captured = {}

    def handler(request: httpx.Request) -> httpx.Response:
        captured["payload"] = json.loads(request.content)
        return httpx.Response(
            200,
            json={
                "choices": [
                    {
                        "message": {
                            "role": "assistant",
                            "content": None,
                            "tool_calls": [
                                {
                                    "id": "c1",
                                    "type": "function",
                                    "function": {
                                        "name": "search_nodes",
                                        "arguments": '{"query": "张三"}',
                                    },
                                }
                            ],
                        }
                    }
                ]
            },
        )

    llm = _openai(monkeypatch, transport=httpx.MockTransport(handler))
    msg = _run(
        llm.chat(
            [LLMMessage.user("查找张三")],
            tools=[{"name": "search_nodes", "description": "模糊搜索", "parameters": {}}],
        )
    )
    # 请求载荷：model / messages 转换 / tools 转换
    assert captured["payload"]["model"] == "test-model"
    assert captured["payload"]["messages"][0] == {"role": "user", "content": "查找张三"}
    assert captured["payload"]["tools"][0]["function"]["name"] == "search_nodes"
    # 响应解析
    assert msg.content == ""
    assert len(msg.tool_calls) == 1
    assert msg.tool_calls[0].id == "c1"
    assert msg.tool_calls[0].name == "search_nodes"
    assert msg.tool_calls[0].arguments == {"query": "张三"}


def test_openai_roundtrip_tool_history(monkeypatch):
    """assistant(tool_calls) 与 tool 消息的往返转换。"""
    captured = {}

    def handler(request: httpx.Request) -> httpx.Response:
        captured["payload"] = json.loads(request.content)
        return httpx.Response(
            200, json={"choices": [{"message": {"role": "assistant", "content": "完成"}}]}
        )

    llm = _openai(monkeypatch, transport=httpx.MockTransport(handler))
    call = ToolCall(id="mock-0", name="search_nodes", arguments={"query": "张三"})
    history = [
        LLMMessage.user("查找"),
        LLMMessage.assistant(tool_calls=[call]),
        LLMMessage.tool("mock-0", "找到 3 个节点"),
    ]
    _run(llm.chat(history))
    msgs = captured["payload"]["messages"]
    assert msgs[1]["role"] == "assistant"
    assert msgs[1]["tool_calls"][0]["id"] == "mock-0"
    assert msgs[1]["tool_calls"][0]["function"]["name"] == "search_nodes"
    assert json.loads(msgs[1]["tool_calls"][0]["function"]["arguments"]) == {"query": "张三"}
    assert msgs[2] == {"role": "tool", "tool_call_id": "mock-0", "content": "找到 3 个节点"}


def test_openai_requires_config(monkeypatch):
    monkeypatch.delenv("LLM_BASE_URL", raising=False)
    monkeypatch.delenv("LLM_MODEL", raising=False)
    with pytest.raises(ValueError, match="LLM_BASE_URL"):
        OpenAILLMClient()


def test_openai_http_error(monkeypatch):
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(401, json={"error": "unauthorized"})

    llm = _openai(monkeypatch, transport=httpx.MockTransport(handler))
    with pytest.raises(httpx.HTTPStatusError):
        _run(llm.chat([LLMMessage.user("hi")]))


# ── get_llm 工厂 ─────────────────────────────────────────

def test_factory_default_mock(monkeypatch):
    monkeypatch.delenv("LLM_PROVIDER", raising=False)
    assert isinstance(get_llm(), MockLLM)


def test_factory_mock_reads_script_env(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "mock")
    monkeypatch.setenv(
        "MOCK_SCRIPT",
        '{"trigger":["查找"],"tool_calls":[{"name":"search_nodes","arguments":{"query":"张三"}}]}',
    )
    llm = get_llm()
    assert isinstance(llm, MockLLM)
    msg = _run(llm.chat([LLMMessage(role="user", content="帮我查找张三")]))
    assert msg.tool_calls[0].name == "search_nodes"


def test_factory_mock_ignores_bad_script_env(monkeypatch):
    monkeypatch.setenv("MOCK_SCRIPT", "{not-json")
    llm = get_llm()
    assert isinstance(llm, MockLLM)
    msg = _run(llm.chat([LLMMessage(role="user", content="hi")]))
    assert msg.content == "[mock] hi"


def test_factory_openai_without_config_raises(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "openai")
    monkeypatch.delenv("LLM_BASE_URL", raising=False)
    monkeypatch.delenv("LLM_MODEL", raising=False)
    with pytest.raises(ValueError):
        get_llm()


def test_factory_openai_with_config(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "openai")
    monkeypatch.setenv("LLM_BASE_URL", "http://llm.test/v1")
    monkeypatch.setenv("LLM_MODEL", "m")
    monkeypatch.setenv("LLM_API_KEY", "k")
    assert isinstance(get_llm(), OpenAILLMClient)


def test_factory_unknown_provider(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "xxx")
    with pytest.raises(ValueError):
        get_llm()
