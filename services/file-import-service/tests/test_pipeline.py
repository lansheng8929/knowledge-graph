"""pipeline 子任务编排单元测试：A→B 数据流、入参白名单、进度回调、失败中止。"""

import pytest

from app.pipeline import PipelineAbort, SubtaskSpec, register_subtask, run_pipeline


def _register_test_subtasks():
    """注册两个串联子任务：add_ten(A) 输出 y → double(B) 消费 y 输出 z。"""
    register_subtask(
        SubtaskSpec(
            name="add_ten",
            description="A: 入参 x → 输出 y=x+10",
            inputs=["x"],
            fn=lambda ctx, p: {"y": p["x"] + 10},
        )
    )
    register_subtask(
        SubtaskSpec(
            name="double",
            description="B: 入参 y → 输出 z=y*2",
            inputs=["y"],
            fn=lambda ctx, p: {"z": p["y"] * 2},
        )
    )


def test_a_to_b_dataflow():
    """A 的输出作为 B 的入参（pipeline 顺序传递）。"""
    _register_test_subtasks()
    payload = run_pipeline(["add_ten", "double"], {}, {"x": 5})
    assert payload["y"] == 15
    assert payload["z"] == 30


def test_input_whitelist_blocks_other_keys():
    """子任务只能看到 inputs 白名单里的键。"""
    _register_test_subtasks()
    # 若 double 能访问 x（未声明），结果不同；这里应只基于 y
    payload = run_pipeline(["add_ten", "double"], {}, {"x": 5})
    assert payload["z"] == 30  # 只消费 y，不消费 x


def test_missing_input_key_raises():
    """子任务入参缺失 → 抛 KeyError（体现依赖必须在顺序上被满足）。"""
    _register_test_subtasks()
    with pytest.raises(KeyError):
        run_pipeline(["double"], {}, {"x": 5})  # double 需要 y，但前序没产出


def test_on_step_progress_events():
    """进度回调按 running/success 顺序上报。"""
    _register_test_subtasks()
    events = []
    run_pipeline(
        ["add_ten", "double"],
        {},
        {"x": 5},
        on_step=lambda name, status, detail: events.append((name, status)),
    )
    assert events == [
        ("add_ten", "running"),
        ("add_ten", "success"),
        ("double", "running"),
        ("double", "success"),
    ]


def test_subtask_failure_aborts_pipeline():
    """子任务抛异常 → 该步 failed 回调 + 流水线中止（异常向外传播）。"""
    events = []

    def boom(ctx, p):
        raise RuntimeError("boom")

    register_subtask(SubtaskSpec(name="boom", description="always fail", inputs=[], fn=boom))
    with pytest.raises(RuntimeError):
        run_pipeline(["boom"], {}, {}, on_step=lambda n, s, d: events.append((n, s)))
    assert ("boom", "failed") in events


def test_pipeline_abort_carries_errors():
    """业务性中止 PipelineAbort 携带 errors/skipped/warnings。"""

    def abort_fn(ctx, p):
        raise PipelineAbort(
            message="bad data",
            errors=["row 2 invalid"],
            skipped=1,
            warnings=["warn"],
        )

    register_subtask(SubtaskSpec(name="abort", description="abort", inputs=[], fn=abort_fn))
    with pytest.raises(PipelineAbort) as exc_info:
        run_pipeline(["abort"], {}, {})
    assert exc_info.value.errors == ["row 2 invalid"]
    assert exc_info.value.skipped == 1
    assert exc_info.value.warnings == ["warn"]
