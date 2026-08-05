"""通用文档存储（业务无关：只存 kind + id + JSON 文档）。

Memory（测试/演示）与 Postgres（生产）同接口；
定位"只提供数据存储" → 文档模型最贴合（不预设业务表结构）。
"""

from __future__ import annotations

import json
import time
from typing import Any, Callable, Dict, List, Optional


def _connect_with_retry(dsn: str, attempts: int = 15, base_delay: float = 0.5):
    """psycopg.connect 带线性退避重试（依赖库启动竞态）。"""
    import psycopg

    last: Optional[Exception] = None
    for i in range(1, attempts + 1):
        try:
            return psycopg.connect(dsn)
        except psycopg.OperationalError as exc:
            last = exc
            time.sleep(base_delay * i)
    assert last is not None
    raise last


class Store:
    """文档存储接口。"""

    def put(self, kind: str, doc: Dict[str, Any]) -> Dict[str, Any]:
        raise NotImplementedError

    def get(self, kind: str, doc_id: str) -> Optional[Dict[str, Any]]:
        raise NotImplementedError

    def find(
        self,
        kind: str,
        predicate: Optional[Callable[[Dict[str, Any]], bool]] = None,
    ) -> List[Dict[str, Any]]:
        raise NotImplementedError

    def delete(self, kind: str, doc_id: str) -> bool:
        raise NotImplementedError


class MemoryStore(Store):
    def __init__(self) -> None:
        self._tables: Dict[str, Dict[str, Dict[str, Any]]] = {}

    def put(self, kind: str, doc: Dict[str, Any]) -> Dict[str, Any]:
        self._tables.setdefault(kind, {})[doc["id"]] = dict(doc)
        return dict(doc)

    def get(self, kind: str, doc_id: str) -> Optional[Dict[str, Any]]:
        return self._tables.get(kind, {}).get(doc_id)

    def find(self, kind: str, predicate=None) -> List[Dict[str, Any]]:
        rows = list(self._tables.get(kind, {}).values())
        return [dict(r) for r in rows if predicate is None or predicate(r)]

    def delete(self, kind: str, doc_id: str) -> bool:
        return self._tables.get(kind, {}).pop(doc_id, None) is not None


class PostgresStore(Store):
    """PostgreSQL 文档存储（表 core_records：kind + id + doc JSONB）。"""

    def __init__(self, dsn: str) -> None:
        self._dsn = dsn

    def _conn(self):
        conn = _connect_with_retry(self._dsn)
        conn.execute(
            """CREATE TABLE IF NOT EXISTS core_records (
                kind TEXT NOT NULL, id TEXT NOT NULL,
                doc JSONB NOT NULL,
                PRIMARY KEY (kind, id)
            )"""
        )
        return conn

    def put(self, kind: str, doc: Dict[str, Any]) -> Dict[str, Any]:
        with self._conn() as conn:
            conn.execute(
                """INSERT INTO core_records (kind, id, doc) VALUES (%s,%s,%s)
                   ON CONFLICT (kind, id) DO UPDATE SET doc=EXCLUDED.doc""",
                (kind, doc["id"], json.dumps(doc, ensure_ascii=False)),
            )
        return dict(doc)

    def get(self, kind: str, doc_id: str) -> Optional[Dict[str, Any]]:
        with self._conn() as conn:
            row = conn.execute(
                "SELECT doc FROM core_records WHERE kind=%s AND id=%s",
                (kind, doc_id),
            ).fetchone()
        return row[0] if row else None

    def find(self, kind: str, predicate=None) -> List[Dict[str, Any]]:
        with self._conn() as conn:
            rows = conn.execute(
                "SELECT doc FROM core_records WHERE kind=%s", (kind,)
            ).fetchall()
        docs = [dict(r[0]) for r in rows]
        return [d for d in docs if predicate is None or predicate(d)]

    def delete(self, kind: str, doc_id: str) -> bool:
        with self._conn() as conn:
            cur = conn.execute(
                "DELETE FROM core_records WHERE kind=%s AND id=%s",
                (kind, doc_id),
            )
        return cur.rowcount > 0


def create_store(kind: str, dsn: str = "") -> Store:
    if kind == "postgres":
        return PostgresStore(dsn or "postgresql://kg:kg@localhost:5432/kg")
    return MemoryStore()
