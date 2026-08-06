"""导入任务管理（P1 内存 → P2 落库 Postgres，TASK_STORE=postgres）。"""

from __future__ import annotations

import json
import time
import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def task_visible_to(task: "ImportTask", subject: Dict[str, Any]) -> bool:
    """历史任务可见性：同一租户 + 属主范围（自己 uid/用户名 或 以下 subUids）。"""
    if task.tenant_id and task.tenant_id != str(subject.get("tenantId", "default")):
        return False
    uid = str(subject.get("uid", ""))
    username = str(subject.get("username", ""))
    sub_uids = {str(u) for u in subject.get("subUids", [])}
    return (
        (task.owner_uid and task.owner_uid == uid)
        or (task.owner and task.owner == username)
        or (task.owner_uid and task.owner_uid in sub_uids)
        or (task.owner and task.owner in sub_uids)
    )


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
    # 该任务实际导入的实体 id（供前端跳转图谱定位展示）
    entity_ids: List[str] = field(default_factory=list)
    # 导入者归属（历史任务按属主范围过滤：自己及以下）
    owner: str = ""  # 用户名（与打标 owner 一致）
    owner_uid: str = ""  # uid（用于“以下=subUids”匹配）
    tenant_id: str = "default"

    def to_dict(self) -> dict:
        return asdict(self)

    def summary_dict(self) -> dict:
        """列表用摘要（不含 errors/warnings，保持轻量）。"""
        return {
            "id": self.id,
            "filename": self.filename,
            "status": self.status,
            "stage": self.stage,
            "imported": self.imported,
            "skipped": self.skipped,
            "error_count": self.error_count,
            "created_at": self.created_at,
            "finished_at": self.finished_at,
            "entity_ids": self.entity_ids,
            "owner": self.owner,
            "owner_uid": self.owner_uid,
            "tenant_id": self.tenant_id,
        }


class MemoryTaskStore:
    """进程内任务表（P1；容器重启清空，多 worker 各自独立）。"""

    def __init__(self) -> None:
        self._tasks: Dict[str, ImportTask] = {}

    def create(
        self,
        filename: str = "",
        owner: str = "",
        owner_uid: str = "",
        tenant_id: str = "default",
    ) -> ImportTask:
        task = ImportTask(
            id=uuid.uuid4().hex[:12],
            filename=filename,
            created_at=_now(),
            owner=owner,
            owner_uid=owner_uid,
            tenant_id=tenant_id,
        )
        self._tasks[task.id] = task
        return task

    def get(self, task_id: str) -> Optional[ImportTask]:
        return self._tasks.get(task_id)

    def set_entity_ids(self, task_id: str, entity_ids: List[str]) -> None:
        task = self._tasks[task_id]
        task.entity_ids = list(entity_ids)

    def list(
        self,
        limit: int = 50,
        subject: Optional[Dict[str, Any]] = None,
        authenticated: bool = False,
    ) -> List["ImportTask"]:
        """按创建时间倒序返回最近任务（历史记录）。

        已鉴权（X-User-Context 或有效 JWT）时只返回属主范围（自己及以下）的任务；
        无鉴权直连保持宽松（不拦截）。created_at 精确到秒：先按插入序倒排，
        再稳定排序 → 时间新在前，同秒内保持新插入在前。
        """
        items = list(self._tasks.values())
        if authenticated and subject:
            items = [t for t in items if task_visible_to(t, subject)]
        items.reverse()
        items.sort(key=lambda t: t.created_at, reverse=True)
        return items[:limit]

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


# ── Postgres 任务存储（P2：落库，重启不丢 / 多 worker 一致）──


def _connect_with_retry(dsn: str, attempts: int = 15, base_delay: float = 0.5):
    """psycopg.connect 带线性退避重试（与 auth-service 同模式）。"""
    import psycopg

    last_exc: Optional[BaseException] = None
    for i in range(1, attempts + 1):
        try:
            return psycopg.connect(dsn)
        except psycopg.OperationalError as exc:
            last_exc = exc
            time.sleep(base_delay * i)
    assert last_exc is not None
    raise last_exc


_IMPORT_TASKS_TABLE = """CREATE TABLE IF NOT EXISTS import_tasks (
    id TEXT PRIMARY KEY,
    seq BIGSERIAL,
    filename TEXT, status TEXT, stage TEXT,
    imported INT DEFAULT 0, skipped INT DEFAULT 0, error_count INT DEFAULT 0,
    warnings JSONB DEFAULT '[]', errors JSONB DEFAULT '[]',
    entity_ids JSONB DEFAULT '[]',
    owner TEXT, owner_uid TEXT, tenant_id TEXT,
    created_at TEXT, finished_at TEXT
)"""


class PostgresTaskStore:
    """基于 Postgres import_tasks 表的历史任务存储。"""

    _COLUMNS = (
        "id, filename, status, stage, imported, skipped, error_count, "
        "warnings, errors, entity_ids, owner, owner_uid, tenant_id, "
        "created_at, finished_at"
    )

    def __init__(self, dsn: str) -> None:
        self._dsn = dsn

    def _conn(self):
        conn = _connect_with_retry(self._dsn)
        conn.execute(_IMPORT_TASKS_TABLE)
        return conn

    @staticmethod
    def _row_to_task(row) -> ImportTask:
        return ImportTask(
            id=row[0],
            filename=row[1] or "",
            status=row[2] or "pending",
            stage=row[3] or "",
            imported=row[4] or 0,
            skipped=row[5] or 0,
            error_count=row[6] or 0,
            warnings=row[7] or [],
            errors=row[8] or [],
            entity_ids=row[9] or [],
            owner=row[10] or "",
            owner_uid=row[11] or "",
            tenant_id=row[12] or "default",
            created_at=row[13] or "",
            finished_at=row[14] or "",
        )

    def create(
        self,
        filename: str = "",
        owner: str = "",
        owner_uid: str = "",
        tenant_id: str = "default",
    ) -> ImportTask:
        task = ImportTask(
            id=uuid.uuid4().hex[:12],
            filename=filename,
            created_at=_now(),
            owner=owner,
            owner_uid=owner_uid,
            tenant_id=tenant_id,
        )
        with self._conn() as conn:
            conn.execute(
                """INSERT INTO import_tasks
                   (id, filename, status, stage, imported, skipped, error_count,
                    warnings, errors, entity_ids, owner, owner_uid, tenant_id,
                    created_at, finished_at)
                   VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                (
                    task.id,
                    task.filename,
                    task.status,
                    task.stage,
                    task.imported,
                    task.skipped,
                    task.error_count,
                    json.dumps(task.warnings),
                    json.dumps(task.errors),
                    json.dumps(task.entity_ids),
                    task.owner,
                    task.owner_uid,
                    task.tenant_id,
                    task.created_at,
                    task.finished_at,
                ),
            )
        return task

    def get(self, task_id: str) -> Optional[ImportTask]:
        with self._conn() as conn:
            row = conn.execute(
                f"SELECT {self._COLUMNS} FROM import_tasks WHERE id=%s",
                (task_id,),
            ).fetchone()
        return self._row_to_task(row) if row else None

    def set_entity_ids(self, task_id: str, entity_ids: List[str]) -> None:
        with self._conn() as conn:
            conn.execute(
                "UPDATE import_tasks SET entity_ids=%s WHERE id=%s",
                (json.dumps(list(entity_ids)), task_id),
            )

    def list(
        self,
        limit: int = 50,
        subject: Optional[Dict[str, Any]] = None,
        authenticated: bool = False,
    ) -> List[ImportTask]:
        """按创建时间倒序返回最近任务；已鉴权时按属主范围（自己及以下）过滤。"""
        with self._conn() as conn:
            rows = conn.execute(
                f"SELECT {self._COLUMNS} FROM import_tasks "
                "ORDER BY created_at DESC, seq DESC"
            ).fetchall()
        tasks = [self._row_to_task(r) for r in rows]
        if authenticated and subject:
            tasks = [t for t in tasks if task_visible_to(t, subject)]
        return tasks[:limit]

    def set_stage(self, task_id: str, stage: str) -> None:
        with self._conn() as conn:
            conn.execute(
                "UPDATE import_tasks SET status='running', stage=%s WHERE id=%s",
                (stage, task_id),
            )

    def finish(
        self,
        task_id: str,
        imported: int,
        skipped: int,
        warnings: List[str],
        errors: List[str],
    ) -> None:
        with self._conn() as conn:
            conn.execute(
                """UPDATE import_tasks
                   SET status=%s, stage='done', imported=%s, skipped=%s,
                       error_count=%s, warnings=%s, errors=%s, finished_at=%s
                   WHERE id=%s""",
                (
                    "success" if not errors else "failed",
                    imported,
                    skipped,
                    len(errors),
                    json.dumps(warnings),
                    json.dumps(errors[:20]),
                    _now(),
                    task_id,
                ),
            )

    def fail(self, task_id: str, message: str) -> None:
        with self._conn() as conn:
            conn.execute(
                """UPDATE import_tasks
                   SET status='failed', stage='done', error_count=1,
                       errors=%s, finished_at=%s
                   WHERE id=%s""",
                (json.dumps([message]), _now(), task_id),
            )


def create_task_store(kind: str, dsn: str = "") -> Any:
    """按配置创建任务存储（postgres | memory）。"""
    if kind == "postgres":
        return PostgresTaskStore(dsn)
    return MemoryTaskStore()
