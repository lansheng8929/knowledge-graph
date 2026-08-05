"""导入任务管理（内存态，P1；后续可换 DB / 消息队列）。"""

from __future__ import annotations

import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Dict, List, Optional


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


@dataclass
class ImportTask:
    id: str
    filename: str = ""
    status: str = "pending"  # pending | running | success | failed
    stage: str = ""  # parsing | validating | writing | done
    imported: int = 0
    skipped: int = 0
    error_count: int = 0
    warnings: List[str] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)
    created_at: str = ""
    finished_at: str = ""

    def to_dict(self) -> dict:
        return asdict(self)


class TaskStore:
    """进程内任务表。多 worker 需换成共享存储（后续）。"""

    def __init__(self) -> None:
        self._tasks: Dict[str, ImportTask] = {}

    def create(self, filename: str = "") -> ImportTask:
        task = ImportTask(
            id=uuid.uuid4().hex[:12],
            filename=filename,
            created_at=_now(),
        )
        self._tasks[task.id] = task
        return task

    def get(self, task_id: str) -> Optional[ImportTask]:
        return self._tasks.get(task_id)

    def set_stage(self, task_id: str, stage: str) -> None:
        task = self._tasks[task_id]
        task.stage = stage
        task.status = "running"

    def finish(
        self,
        task_id: str,
        imported: int,
        skipped: int,
        warnings: List[str],
        errors: List[str],
    ) -> None:
        task = self._tasks[task_id]
        task.status = "success" if not errors else "failed"
        task.stage = "done"
        task.imported = imported
        task.skipped = skipped
        task.error_count = len(errors)
        task.warnings = warnings
        task.errors = errors[:20]
        task.finished_at = _now()

    def fail(self, task_id: str, message: str) -> None:
        task = self._tasks[task_id]
        task.status = "failed"
        task.stage = "done"
        task.error_count = 1
        task.errors = [message]
        task.finished_at = _now()
