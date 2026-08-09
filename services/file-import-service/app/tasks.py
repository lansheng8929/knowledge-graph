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
    """历史任务可见性（组织管辖语义）：属主范围 = 自己 uid/用户名 或 以下 subUids。

    上级可看下级的数据，跨租户亦然（组织管辖不受租户隔离限制）；
    非属主（既非自己、也非自己下级）一律不可见。
    """
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
    # pending | queued | running | success | failed
    status: str = "queued"
    stage: str = ""  # parsing | writing | done
    imported: int = 0
    skipped: int = 0
    error_count: int = 0
    warnings: List[str] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)
    created_at: str = ""
    finished_at: str = ""
    # 该任务实际导入的实体 id（供前端跳转图谱定位展示）
    entity_ids: List[str] = field(default_factory=list)
    # ── 主任务/子任务流水线（P3：亲密度编排）───────────
    steps: List[str] = field(default_factory=list)  # 有序子任务名，如 ["parse","compute_intimacy"]
    current_step: str = ""  # 当前执行到的子任务名
    subtasks: List[dict] = field(default_factory=list)  # 子任务进度 [{name,status,detail,started_at,finished_at}]
    queued_at: str = ""
    # 上传入参（含临时文件路径；to_dict 不回传，避免泄漏主体/文件信息）
    payload: dict = field(default_factory=dict)
    # 导入者归属（历史任务按属主范围过滤：自己及以下）
    owner: str = ""  # 用户名（与打标 owner 一致）
    owner_uid: str = ""  # uid（用于“以下=subUids”匹配）
    tenant_id: str = "default"

    def to_dict(self) -> dict:
        d = asdict(self)
        d.pop("payload", None)
        return d

    def summary_dict(self) -> dict:
        """列表用摘要（不含 errors/warnings/payload，保持轻量）。"""
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
            "steps": self.steps,
            "current_step": self.current_step,
            "subtasks": [
                {"name": s.get("name"), "status": s.get("status")} for s in self.subtasks
            ],
            "owner": self.owner,
            "owner_uid": self.owner_uid,
            "tenant_id": self.tenant_id,
        }


def _upsert_subtask(
    subtasks: List[dict],
    name: str,
    status: str = "",
    detail: str = "",
    started_at: str = "",
    finished_at: str = "",
) -> List[dict]:
    """更新/追加子任务进度（name 幂等）。"""
    out = list(subtasks)
    for s in out:
        if s.get("name") == name:
            if status:
                s["status"] = status
            if detail:
                s["detail"] = detail
            if started_at:
                s["started_at"] = started_at
            if finished_at:
                s["finished_at"] = finished_at
            return out
    out.append(
        {
            "name": name,
            "status": status or "pending",
            "detail": detail,
            "started_at": started_at,
            "finished_at": finished_at,
        }
    )
    return out


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
        steps: Optional[List[str]] = None,
        payload: Optional[dict] = None,
    ) -> ImportTask:
        now = _now()
        task = ImportTask(
            id=uuid.uuid4().hex[:12],
            filename=filename,
            status="queued",
            created_at=now,
            queued_at=now,
            steps=list(steps or []),
            payload=dict(payload or {}),
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

    def set_payload(self, task_id: str, payload: dict) -> None:
        task = self._tasks[task_id]
        task.payload = dict(payload)

    def set_current_step(self, task_id: str, name: str) -> None:
        task = self._tasks[task_id]
        task.current_step = name
        task.subtasks = _upsert_subtask(
            task.subtasks, name, status="running", started_at=_now()
        )

    def update_subtask(
        self, task_id: str, name: str, status: str, detail: str = ""
    ) -> None:
        task = self._tasks[task_id]
        finished = _now() if status in ("success", "failed") else ""
        task.subtasks = _upsert_subtask(
            task.subtasks, name, status=status, detail=detail, finished_at=finished
        )

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
    steps JSONB DEFAULT '[]', current_step TEXT DEFAULT '',
    subtasks JSONB DEFAULT '[]', queued_at TEXT DEFAULT '',
    payload JSONB DEFAULT '{}',
    owner TEXT, owner_uid TEXT, tenant_id TEXT,
    created_at TEXT, finished_at TEXT
)"""

# P3 新增列（对已存在的旧表做幂等迁移）
_P3_COLUMNS = (
    ("steps", "JSONB DEFAULT '[]'"),
    ("current_step", "TEXT DEFAULT ''"),
    ("subtasks", "JSONB DEFAULT '[]'"),
    ("queued_at", "TEXT DEFAULT ''"),
    ("payload", "JSONB DEFAULT '{}'"),
)


class PostgresTaskStore:
    """基于 Postgres import_tasks 表的历史任务存储。"""

    _COLUMNS = (
        "id, filename, status, stage, imported, skipped, error_count, "
        "warnings, errors, entity_ids, steps, current_step, subtasks, queued_at, "
        "payload, owner, owner_uid, tenant_id, "
        "created_at, finished_at"
    )

    def __init__(self, dsn: str) -> None:
        self._dsn = dsn

    def _conn(self):
        conn = _connect_with_retry(self._dsn)
        conn.execute(_IMPORT_TASKS_TABLE)
        self._ensure_columns(conn)
        return conn

    @staticmethod
    def _ensure_columns(conn) -> None:
        """幂等迁移：为旧表补齐 P3 新增列（CREATE IF NOT EXISTS 不改已有表）。"""
        existing = {
            r[0]
            for r in conn.execute(
                "SELECT column_name FROM information_schema.columns "
                "WHERE table_name='import_tasks'"
            ).fetchall()
        }
        for name, ddl in _P3_COLUMNS:
            if name not in existing:
                conn.execute(f"ALTER TABLE import_tasks ADD COLUMN {name} {ddl}")

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
            steps=row[10] or [],
            current_step=row[11] or "",
            subtasks=row[12] or [],
            queued_at=row[13] or "",
            payload=row[14] or {},
            owner=row[15] or "",
            owner_uid=row[16] or "",
            tenant_id=row[17] or "default",
            created_at=row[18] or "",
            finished_at=row[19] or "",
        )

    def create(
        self,
        filename: str = "",
        owner: str = "",
        owner_uid: str = "",
        tenant_id: str = "default",
        steps: Optional[List[str]] = None,
        payload: Optional[dict] = None,
    ) -> ImportTask:
        now = _now()
        task = ImportTask(
            id=uuid.uuid4().hex[:12],
            filename=filename,
            status="queued",
            created_at=now,
            queued_at=now,
            steps=list(steps or []),
            payload=dict(payload or {}),
            owner=owner,
            owner_uid=owner_uid,
            tenant_id=tenant_id,
        )
        with self._conn() as conn:
            conn.execute(
                """INSERT INTO import_tasks
                   (id, filename, status, stage, imported, skipped, error_count,
                    warnings, errors, entity_ids, steps, current_step, subtasks,
                    queued_at, payload, owner, owner_uid, tenant_id,
                    created_at, finished_at)
                   VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
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
                    json.dumps(task.steps),
                    task.current_step,
                    json.dumps(task.subtasks),
                    task.queued_at,
                    json.dumps(task.payload),
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

    def set_payload(self, task_id: str, payload: dict) -> None:
        with self._conn() as conn:
            conn.execute(
                "UPDATE import_tasks SET payload=%s WHERE id=%s",
                (json.dumps(dict(payload or {})), task_id),
            )

    def set_current_step(self, task_id: str, name: str) -> None:
        with self._conn() as conn:
            subtasks = self._load_subtasks(conn, task_id)
            subtasks = _upsert_subtask(
                subtasks, name, status="running", started_at=_now()
            )
            conn.execute(
                "UPDATE import_tasks SET current_step=%s, subtasks=%s WHERE id=%s",
                (name, json.dumps(subtasks), task_id),
            )

    def update_subtask(
        self, task_id: str, name: str, status: str, detail: str = ""
    ) -> None:
        with self._conn() as conn:
            subtasks = self._load_subtasks(conn, task_id)
            finished = _now() if status in ("success", "failed") else ""
            subtasks = _upsert_subtask(
                subtasks, name, status=status, detail=detail, finished_at=finished
            )
            conn.execute(
                "UPDATE import_tasks SET subtasks=%s WHERE id=%s",
                (json.dumps(subtasks), task_id),
            )

    @staticmethod
    def _load_subtasks(conn, task_id: str) -> List[dict]:
        row = conn.execute(
            "SELECT subtasks FROM import_tasks WHERE id=%s", (task_id,)
        ).fetchone()
        return row[0] if row and row[0] else []

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
