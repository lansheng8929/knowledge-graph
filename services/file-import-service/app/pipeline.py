"""主任务/子任务流水线：子任务注册表 + 串行执行器。

设计（docs/intimacy-pipeline-plan.md §4.1）：
- **主任务** = 有序 `steps: List[str]`，由全局队列串行调度（见 app/queue.py）。
- **子任务** = {name, inputs[], run(ctx, sub_input) -> 增量payload}，注册到 SUBTASKS。
  每个子任务的入参是主 payload 的**白名单子集**（inputs），输出 merge 回主 payload
  —— 上游输出直接作为下游入参，未来可自由调整子任务顺序与入参。
- 当前主任务默认 steps = ["parse", "compute_intimacy"]：
  - parse（A）：解析文件 → ParsedGraph（实体+边）
  - compute_intimacy（B）：接收 A 的实体+边，在全库计算亲密度并写库
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Callable, Dict, List, Optional


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


class PipelineAbort(RuntimeError):
    """子任务业务性中止（非异常崩溃）：携带可展示的 errors/skipped/warnings。"""

    def __init__(
        self,
        message: str = "",
        errors: Optional[List[str]] = None,
        skipped: int = 0,
        warnings: Optional[List[str]] = None,
    ) -> None:
        super().__init__(message or "pipeline aborted")
        self.message = message
        self.errors = list(errors or [])
        self.skipped = skipped
        self.warnings = list(warnings or [])


@dataclass
class SubtaskSpec:
    name: str
    description: str
    # 从主 payload 读取的输入键（子任务入参白名单）
    inputs: List[str]
    # run(ctx, sub_input) -> dict（增量写回主 payload；可返回 None）
    fn: Callable[..., Optional[dict]]


SUBTASKS: Dict[str, SubtaskSpec] = {}


def register_subtask(spec: SubtaskSpec) -> None:
    """注册子任务到注册表（未来新增子任务只需在此注册）。"""
    SUBTASKS[spec.name] = spec


def get_subtask(name: str) -> SubtaskSpec:
    if name not in SUBTASKS:
        raise KeyError(f"unknown subtask: {name}")
    return SUBTASKS[name]


@dataclass
class SubtaskStatus:
    name: str
    status: str = "pending"  # pending | running | success | failed
    detail: str = ""
    started_at: str = ""
    finished_at: str = ""

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "status": self.status,
            "detail": self.detail,
            "started_at": self.started_at,
            "finished_at": self.finished_at,
        }


def run_pipeline(
    steps: List[str],
    ctx: Dict[str, Any],
    payload: Dict[str, Any],
    on_step: Optional[Callable[[str, str, str], None]] = None,
) -> Dict[str, Any]:
    """串行执行主任务的各子任务。

    - 每步从 payload 提取 inputs 白名单子集作为入参；
    - 输出 merge 回 payload（A→B 数据流）；
    - 任一步抛异常 → 中止整条流水线（异常向外传播，由调用方判定任务状态）。
    - on_step(name, status, detail)：running / success / failed 时回调（进度上报）。

    Returns:
        最终 payload（含各子任务输出）。
    """
    for name in steps:
        spec = get_subtask(name)
        if on_step:
            on_step(name, "running", "")
        try:
            sub_input = {k: payload[k] for k in spec.inputs if k in payload}
            out = spec.fn(ctx, sub_input)
            if out:
                payload.update(out)
        except Exception as e:
            if on_step:
                on_step(name, "failed", str(e))
            raise
        if on_step:
            on_step(name, "success", "")
    return payload
