"""会话存储（P2-A：postgres）。

实现 docs/session-persistence-plan.md §4/§7：
- 两张表：agent_conversations / agent_messages（Postgres 权威层）
- 前端 IndexedDB 承担本地会话缓存，后端只保留 Postgres 权威存储（无 memory 后备）
- session_id 服务端生成（uuid4）；owner 归属绑定（X-User-Context.uid，防越权）
- system 提示词不落库（运行期由 SYSTEM_PROMPT 常量注入），落库 user/assistant/tool
- 懒建表（_conn 内 CREATE TABLE IF NOT EXISTS）+ 线性退避重连，
  与 auth-service / file-import-service 同风格。

消息 dict 形态与 app.models.LLMMessage.model_dump() 一致：
{role, content, tool_calls: [...], tool_call_id: str|None}
"""

from __future__ import annotations

import json
import time
import uuid
from typing import List, Optional


def _now_iso() -> str:
    return datetime_now().strftime("%Y-%m-%dT%H:%M:%SZ")


def datetime_now():
    from datetime import datetime, timezone

    return datetime.now(timezone.utc)


def _title_of(message: str, limit: int = 30) -> str:
    """会话标题：取首条 user 消息前 limit 字符（去换行折叠为单行）。"""
    text = (message or "").strip().replace("\n", " ")
    return text[:limit]


# ── Postgres 会话存储（P2-A：落库，重启不丢 / 多 worker 一致）──────


def _connect_with_retry(dsn: str, attempts: int = 15, base_delay: float = 0.5):
    """psycopg.connect 带线性退避重试（与 auth-service 同模式）。"""
    import psycopg  # 延迟导入（与仓库其他服务一致）

    last_exc: Optional[BaseException] = None
    for i in range(1, attempts + 1):
        try:
            return psycopg.connect(dsn)
        except psycopg.OperationalError as exc:
            last_exc = exc
            time.sleep(base_delay * i)
    assert last_exc is not None
    raise last_exc


_AGENT_TABLES = """
CREATE TABLE IF NOT EXISTS agent_conversations (
    id         TEXT        PRIMARY KEY,
    owner      TEXT        NOT NULL,
    title      TEXT        NOT NULL DEFAULT '',
    created_at TEXT        NOT NULL,
    updated_at TEXT        NOT NULL,
    last_seq   BIGINT      NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS agent_messages (
    conversation_id TEXT   NOT NULL REFERENCES agent_conversations(id) ON DELETE CASCADE,
    seq             BIGINT NOT NULL,
    role            TEXT   NOT NULL,
    content         TEXT   NOT NULL DEFAULT '',
    tool_calls      JSONB  NOT NULL DEFAULT '[]',
    tool_call_id    TEXT,
    created_at      TEXT   NOT NULL,
    PRIMARY KEY (conversation_id, seq)
);
CREATE INDEX IF NOT EXISTS idx_agent_messages_conv
    ON agent_messages (conversation_id, seq);
"""


class PostgresSessionStore:
    """基于 Postgres agent_conversations / agent_messages 表的会话存储。"""

    _CONV_COLUMNS = "id, owner, title, created_at, updated_at, last_seq"

    def __init__(self, dsn: str) -> None:
        self._dsn = dsn

    def _conn(self):
        conn = _connect_with_retry(self._dsn)
        conn.execute(_AGENT_TABLES)  # 懒建表：每次取连接确保表存在
        return conn

    @staticmethod
    def _conv_row_to_dict(row) -> dict:
        return {
            "id": row[0],
            "owner": row[1],
            "title": row[2] or "",
            "created_at": row[3],
            "updated_at": row[4],
            "last_seq": row[5] or 0,
        }

    @staticmethod
    def _msg_row_to_dict(row) -> dict:
        return {
            "seq": row[0],
            "role": row[1],
            "content": row[2] or "",
            "tool_calls": row[3] or [],
            "tool_call_id": row[4],
        }

    def create(
        self, owner: str, message: str, session_id: Optional[str] = None
    ) -> dict:
        now = _now_iso()
        sid = session_id or uuid.uuid4().hex
        title = _title_of(message)
        with self._conn() as conn:
            conn.execute(
                """INSERT INTO agent_conversations
                   (id, owner, title, created_at, updated_at, last_seq)
                   VALUES (%s,%s,%s,%s,%s,1)""",
                (sid, owner, title, now, now),
            )
            conn.execute(
                """INSERT INTO agent_messages
                   (conversation_id, seq, role, content, tool_calls, tool_call_id, created_at)
                   VALUES (%s,1,'user',%s,'[]',NULL,%s)""",
                (sid, message or "", now),
            )
        return {
            "id": sid,
            "owner": owner,
            "title": title,
            "created_at": now,
            "updated_at": now,
            "last_seq": 1,
        }

    def get(self, session_id: str, owner: str) -> Optional[dict]:
        with self._conn() as conn:
            row = conn.execute(
                f"SELECT {self._CONV_COLUMNS} FROM agent_conversations "
                "WHERE id=%s AND owner=%s",
                (session_id, owner),
            ).fetchone()
        return self._conv_row_to_dict(row) if row else None

    def append_turn(
        self, session_id: str, owner: str, messages: List[dict]
    ) -> Optional[int]:
        """追加一轮消息：seq 从 last_seq+1 起递增；ON CONFLICT 幂等防并发重复。

        会话不存在 / 归属不符 → None。
        """
        msgs = [m for m in messages if m.get("role") != "system"]
        with self._conn() as conn:
            row = conn.execute(
                "SELECT last_seq FROM agent_conversations WHERE id=%s AND owner=%s",
                (session_id, owner),
            ).fetchone()
            if row is None:
                return None
            seq = (row[0] or 0) + 1
            for m in msgs:
                conn.execute(
                    """INSERT INTO agent_messages
                       (conversation_id, seq, role, content, tool_calls, tool_call_id, created_at)
                       VALUES (%s,%s,%s,%s,%s,%s,%s)
                       ON CONFLICT (conversation_id, seq) DO NOTHING""",
                    (
                        session_id,
                        seq,
                        m.get("role") or "",
                        m.get("content") or "",
                        json.dumps(m.get("tool_calls") or [], ensure_ascii=False),
                        m.get("tool_call_id"),
                        _now_iso(),
                    ),
                )
                seq += 1
            last_seq = seq - 1
            conn.execute(
                "UPDATE agent_conversations SET last_seq=%s, updated_at=%s WHERE id=%s",
                (last_seq, _now_iso(), session_id),
            )
        return last_seq

    def get_messages(
        self,
        session_id: str,
        owner: str,
        before_seq: Optional[int] = None,
        limit: int = 50,
    ) -> List[dict]:
        with self._conn() as conn:
            owned = conn.execute(
                "SELECT 1 FROM agent_conversations WHERE id=%s AND owner=%s",
                (session_id, owner),
            ).fetchone()
            if owned is None:
                return []
            cond, params = "", [session_id]
            if before_seq is not None:
                cond = "AND seq < %s"
                params.append(str(before_seq))
            rows = conn.execute(
                "SELECT seq, role, content, tool_calls, tool_call_id "
                "FROM agent_messages WHERE conversation_id=%s "
                f"{cond} ORDER BY seq DESC LIMIT %s",
                (*params, limit),
            ).fetchall()
        rows.reverse()
        return [self._msg_row_to_dict(r) for r in rows]

    def list_sessions(self, owner: str, limit: int = 50) -> List[dict]:
        with self._conn() as conn:
            rows = conn.execute(
                f"SELECT {self._CONV_COLUMNS} FROM agent_conversations "
                "WHERE owner=%s ORDER BY updated_at DESC, id DESC LIMIT %s",
                (owner, limit),
            ).fetchall()
        return [self._conv_row_to_dict(r) for r in rows]

    def delete(self, session_id: str, owner: str) -> bool:
        with self._conn() as conn:
            cur = conn.execute(
                "DELETE FROM agent_conversations WHERE id=%s AND owner=%s",
                (session_id, owner),
            )
            return cur.rowcount > 0


def create_session_store(dsn: str = "") -> PostgresSessionStore:
    """按配置创建会话存储（仅 Postgres 权威层）。"""
    return PostgresSessionStore(dsn)
