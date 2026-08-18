"""LLMMessage 类方法（system/user/assistant/tool 构造）。"""

from app.models import LLMMessage, ToolCall


def test_system():
    msg = LLMMessage.system("你是助手")
    assert msg.role == "system"
    assert msg.content == "你是助手"
    assert msg.tool_calls == []
    assert msg.tool_call_id is None


def test_user():
    msg = LLMMessage.user("查找张三")
    assert msg.role == "user"
    assert msg.content == "查找张三"


def test_assistant_plain():
    msg = LLMMessage.assistant("这是回答")
    assert msg.role == "assistant"
    assert msg.content == "这是回答"
    assert msg.tool_calls == []


def test_assistant_with_tool_calls():
    calls = [ToolCall(id="mock-0", name="search_nodes", arguments={"query": "张三"})]
    msg = LLMMessage.assistant(tool_calls=calls)
    assert msg.role == "assistant"
    assert msg.content == ""
    assert len(msg.tool_calls) == 1
    assert msg.tool_calls[0].id == "mock-0"


def test_tool_result_message():
    msg = LLMMessage.tool("mock-0", "找到 3 个节点")
    assert msg.role == "tool"
    assert msg.tool_call_id == "mock-0"
    assert msg.content == "找到 3 个节点"
