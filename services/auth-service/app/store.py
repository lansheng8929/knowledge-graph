"""用户存储抽象（T4.1 IDP 完善）：memory | postgres。

用户记录：
  username, uid, tenantId, clearance, roles[], teams[], password_hash, disabled
生产用 Postgres（AUTH_DB_DSN 注入）；演示/测试用 memory。
"""

import json
import time
from typing import Dict, List, Optional


def _connect_with_retry(dsn: str, attempts: int = 15, base_delay: float = 0.5):
    """psycopg.connect 带线性退避重试。

    依赖数据库（Postgres）可能尚未就绪（容器启动竞态），连接会抛
    OperationalError；重试避免 uvicorn worker 在 import 阶段直接崩掉
    （表现为容器 unhealthy、登录 500）。仅启动期执行，最长等待约 1 分钟。
    """
    import psycopg

    last_exc: Optional[Exception] = None
    for i in range(1, attempts + 1):
        try:
            return psycopg.connect(dsn)
        except psycopg.OperationalError as exc:
            last_exc = exc
            time.sleep(base_delay * i)
    assert last_exc is not None
    raise last_exc


class UserStore:
    """用户目录接口。"""

    def get(self, username: str) -> Optional[Dict]:
        raise NotImplementedError

    def list(self) -> List[Dict]:
        raise NotImplementedError

    def upsert(self, user: Dict) -> None:
        raise NotImplementedError

    def delete(self, username: str) -> bool:
        raise NotImplementedError

    def _public(self, user: Dict) -> Dict:
        """对外字段（不含密码哈希）。"""
        return {
            "username": user.get("username"),
            "uid": user.get("uid"),
            "tenantId": user.get("tenantId"),
            "clearance": user.get("clearance"),
            "roles": list(user.get("roles", [])),
            "teams": list(user.get("teams", [])),
            "disabled": bool(user.get("disabled", False)),
        }


class MemoryUserStore(UserStore):
    def __init__(self, seed: Optional[List[Dict]] = None) -> None:
        self._users: Dict[str, Dict] = {}
        for u in seed or []:
            self._users[u["username"]] = u

    def get(self, username: str) -> Optional[Dict]:
        return self._users.get(username)

    def list(self) -> List[Dict]:
        return list(self._users.values())

    def upsert(self, user: Dict) -> None:
        self._users[user["username"]] = user

    def delete(self, username: str) -> bool:
        return self._users.pop(username, None) is not None


class PostgresUserStore(UserStore):
    """PostgreSQL 用户目录（表 auth_users）。需 psycopg。"""

    # 显式列序（与 _row_to_user 索引一致；避免依赖物理列序/ALTER 追加列错位）
    _COLUMNS = (
        "username, uid, tenant_id, clearance, roles, teams, "
        "manager_uid, org_path, password_hash, disabled"
    )

    def __init__(self, dsn: str) -> None:
        self._dsn = dsn

    def _conn(self):
        conn = _connect_with_retry(self._dsn)
        conn.execute(
            """CREATE TABLE IF NOT EXISTS auth_users (
                username TEXT PRIMARY KEY,
                uid TEXT, tenant_id TEXT, clearance INT,
                roles JSONB, teams JSONB,
                manager_uid TEXT, org_path TEXT,
                password_hash TEXT, disabled BOOLEAN DEFAULT FALSE
            )"""
        )
        # 兼容既有表（早期无组织层级列）
        conn.execute("ALTER TABLE auth_users ADD COLUMN IF NOT EXISTS manager_uid TEXT")
        conn.execute("ALTER TABLE auth_users ADD COLUMN IF NOT EXISTS org_path TEXT")
        return conn

    @staticmethod
    def _row_to_user(row) -> Dict:
        return {
            "username": row[0],
            "uid": row[1],
            "tenantId": row[2],
            "clearance": row[3],
            "roles": row[4] or [],
            "teams": row[5] or [],
            "managerUid": row[6],
            "orgPath": row[7],
            "password_hash": row[8],
            "disabled": row[9],
        }

    def get(self, username: str) -> Optional[Dict]:
        with self._conn() as conn:
            row = conn.execute(
                f"SELECT {self._COLUMNS} FROM auth_users WHERE username=%s",
                (username,),
            ).fetchone()
        return self._row_to_user(row) if row else None

    def list(self) -> List[Dict]:
        with self._conn() as conn:
            rows = conn.execute(f"SELECT {self._COLUMNS} FROM auth_users").fetchall()
        return [self._row_to_user(r) for r in rows]

    def upsert(self, user: Dict) -> None:
        with self._conn() as conn:
            conn.execute(
                """INSERT INTO auth_users
                   (username, uid, tenant_id, clearance, roles, teams,
                    manager_uid, org_path, password_hash, disabled)
                   VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                   ON CONFLICT (username) DO UPDATE SET
                     uid=EXCLUDED.uid, tenant_id=EXCLUDED.tenant_id,
                     clearance=EXCLUDED.clearance, roles=EXCLUDED.roles,
                     teams=EXCLUDED.teams, manager_uid=EXCLUDED.manager_uid,
                     org_path=EXCLUDED.org_path,
                     password_hash=EXCLUDED.password_hash,
                     disabled=EXCLUDED.disabled""",
                (
                    user["username"],
                    user.get("uid", ""),
                    user.get("tenantId", "default"),
                    int(user.get("clearance", 0)),
                    json.dumps(list(user.get("roles", []))),
                    json.dumps(list(user.get("teams", []))),
                    user.get("managerUid", ""),
                    user.get("orgPath", ""),
                    user["password_hash"],
                    bool(user.get("disabled", False)),
                ),
            )

    def delete(self, username: str) -> bool:
        with self._conn() as conn:
            cur = conn.execute("DELETE FROM auth_users WHERE username=%s", (username,))
        return cur.rowcount > 0


def create_user_store(kind: str, dsn: str = "") -> UserStore:
    if kind == "postgres":
        return PostgresUserStore(dsn)
    return MemoryUserStore()
