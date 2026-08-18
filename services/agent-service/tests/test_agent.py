"""run_agent 工具循环：事件序列 / 工具成功失败 / 轮数超限 / 分块裁剪 / subject 透传。

契约：正常路径事件序列 = tool(start) → tool(done|error) → … → delta* → done；
done 携带 session_id 与完整消息历史 messages。
"""

import asyncio

import app.agent as agent_mod
from app.llm import MockLLM
from app.models import (
    ChatContext,
    LLMMessage,
    ToolCall,
    ToolResult,
    ToolSpec,
)
from app.tools.registry import ToolRegistry


def _collect(*, message="你好", context=None, session_id=None, llm, tools):
    async def _inner():
        return [
            ev
            async for ev in agent_mod.run_agent(
                message=message,
                context=context,
                session_id=session_id,
                llm=llm,
                tools=tools,
            )
        ]

    return asyncio.run(_inner())


async def _ok_handler(call: ToolCall, subject: dict) -> ToolResult:
    return ToolResult(tool_call_id=call.id, ok=True, summary="找到 3 个节点")


class RecordingLLM:
    """记录每轮收到的 messages，按预设回复列表依次应答。"""

    def __init__(self, replies):
        self.replies = list(replies)
        self.seen = []

    async def chat(self, messages, tools=None):
        self.seen.append([m.model_copy(deep=True) for m in messages])
        return self.replies.pop(0)


def _registry_with(handler=None):
    reg = ToolRegistry()
    reg.register(
        ToolSpec(name="search_nodes", description="模糊搜索节点", parameters={}),
        handler or _ok_handler,
    )
    return reg


def test_plain_reply_delta_chunks():
    text = "x" * 200  # 64/块 → 4 个 delta + done
    llm = RecordingLLM([LLMMessage.assistant(text)])
    events = _collect(llm=llm, tools=_registry_with())
    assert [e.event for e in events] == ["delta"] * 4 + ["done"]
    assert "".join(e.data["text"] for e in events[:-1]) == text


def test_done_carries_session_and_messages():
    llm = RecordingLLM([LLMMessage.assistant("完成")])
    events = _collect(message="你好", session_id="s-1", llm=llm, tools=_registry_with())
    done = events[-1]
    assert done.event == "done"
    assert done.data["session_id"] == "s-1"
    msgs = done.data["messages"]
    assert msgs[0]["role"] == "system"
    assert msgs[1]["role"] == "user"
    assert msgs[1]["content"] == "你好"
    assert msgs[-1]["role"] == "assistant"


def test_tool_success_flow():
    call = ToolCall(id="c1", name="search_nodes", arguments={"query": "张三"})
    llm = RecordingLLM(
        [
            LLMMessage.assistant(tool_calls=[call]),
            LLMMessage.assistant("查找到 3 个相关节点。"),
        ]
    )
    events = _collect(message="帮我查找张三", llm=llm, tools=_registry_with())
    assert [(e.event, e.data.get("status")) for e in events] == [
        ("tool", "start"),
        ("tool", "done"),
        ("delta", None),
        ("done", None),
    ]
    # 第二轮 LLM 应看到工具结果消息（tool_call_id 对应回填）
    assert llm.seen[1][-1].role == "tool"
    assert llm.seen[1][-1].tool_call_id == "c1"
    assert "找到 3 个节点" in llm.seen[1][-1].content
    # done 的 messages 里也包含工具结果
    tool_msgs = [m for m in events[-1].data["messages"] if m["role"] == "tool"]
    assert len(tool_msgs) == 1
    assert "找到 3 个节点" in tool_msgs[0]["content"]


def test_tool_failure_flow():
    async def fail_handler(call: ToolCall, subject: dict) -> ToolResult:
        return ToolResult(tool_call_id=call.id, ok=False, summary="工具执行失败: boom")

    call = ToolCall(id="c1", name="search_nodes", arguments={})
    llm = RecordingLLM(
        [
            LLMMessage.assistant(tool_calls=[call]),
            LLMMessage.assistant("查询失败了。"),
        ]
    )
    events = _collect(llm=llm, tools=_registry_with(fail_handler))
    assert [(e.event, e.data.get("status")) for e in events] == [
        ("tool", "start"),
        ("tool", "error"),
        ("delta", None),
        ("done", None),
    ]
    assert llm.seen[1][-1].content == "工具执行失败: boom"


def test_unknown_tool_executed():
    call = ToolCall(id="c1", name="nope", arguments={})
    llm = RecordingLLM(
        [
            LLMMessage.assistant(tool_calls=[call]),
            LLMMessage.assistant("该工具不可用。"),
        ]
    )
    events = _collect(llm=llm, tools=_registry_with())
    assert events[1].data["status"] == "error"
    assert "未知工具" in events[1].data["summary"]


def test_max_turns_exhausted(monkeypatch):
    monkeypatch.setattr(agent_mod, "MAX_TOOL_TURNS", 1)
    always_tool = MockLLM(
        script={
            "trigger": ["查找"],
            "tool_calls": [{"name": "search_nodes", "arguments": {}}],
        }
    )
    events = _collect(message="查找", llm=always_tool, tools=_registry_with())
    assert events[-2].event == "error"
    assert "超过最大工具轮数" in events[-2].data["message"]
    assert events[-1].event == "done"


def test_output_truncated(monkeypatch):
    monkeypatch.setattr(agent_mod, "MAX_OUTPUT_TOKENS", 100)
    llm = RecordingLLM([LLMMessage.assistant("y" * 300)])
    events = _collect(llm=llm, tools=_registry_with())
    text = "".join(e.data["text"] for e in events[:-1])  # 去掉 done
    assert len(text) == 100
    assert events[-1].event == "done"


def test_subject_used_for_execution():
    seen = {}

    async def capture_handler(call: ToolCall, subject: dict) -> ToolResult:
        seen["subject"] = subject
        return ToolResult(tool_call_id=call.id, ok=True, summary="ok")

    call = ToolCall(id="c1", name="search_nodes", arguments={})
    llm = RecordingLLM(
        [
            LLMMessage.assistant(tool_calls=[call]),
            LLMMessage.assistant("完成"),
        ]
    )
    ctx = ChatContext(subject={"uid": "u1", "username": "张三"})
    _collect(message="查找", context=ctx, llm=llm, tools=_registry_with(capture_handler))
    assert seen["subject"] == {"uid": "u1", "username": "张三"}


def test_empty_reply_only_done():
    llm = RecordingLLM([LLMMessage.assistant("")])
    events = _collect(llm=llm, tools=_registry_with())
    assert [e.event for e in events] == ["done"]  # 无内容 → 无 delta，仅 done 收尾
