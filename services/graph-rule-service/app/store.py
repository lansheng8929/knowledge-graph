"""规则存储：PostgreSQL（psycopg）或内存 fallback（T2.1.1 / T2.1.3）。

RULE_STORE=postgres 使用 PostgreSQL（用户手动装 docker）；
RULE_STORE=memory（默认）用于开发/测试，无外部依赖。
"""

import time
from abc import ABC, abstractmethod
from typing import Dict, List, Optional

from .config import settings
from .models import RuleCreate, RuleDefinition, RuleStatus


def _now() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


class RuleStore(ABC):
    def ensure_ready(self) -> None:
        """初始化存储（建表等）；默认 no-op。"""

    @abstractmethod
    def list(self) -> List[RuleDefinition]: ...

    @abstractmethod
    def get(self, rule_id: str) -> Optional[RuleDefinition]: ...

    @abstractmethod
    def create(self, data: RuleCreate) -> RuleDefinition: ...

    @abstractmethod
    def update(self, rule_id: str, data: RuleCreate) -> Optional[RuleDefinition]: ...

    @abstractmethod
    def set_status(self, rule_id: str, status: str) -> Optional[RuleDefinition]: ...

    @abstractmethod
    def delete(self, rule_id: str) -> bool: ...


class InMemoryRuleStore(RuleStore):
    """内存存储（开发/测试）。"""

    def __init__(self) -> None:
        self._rules: Dict[str, RuleDefinition] = {}
        self._seq = 0

    def _next_id(self) -> str:
        self._seq += 1
        return f"rule-{self._seq}"

    def list(self) -> List[RuleDefinition]:
        return list(self._rules.values())

    def get(self, rule_id: str) -> Optional[RuleDefinition]:
        return self._rules.get(rule_id)

    def create(self, data: RuleCreate) -> RuleDefinition:
        rule = RuleDefinition(
            id=self._next_id(),
            name=data.name,
            version=1,
            status=RuleStatus.DRAFT,
            owner=data.owner,
            description=data.description,
            allowedTargetTypes=data.allowedTargetTypes,
            allowedRelationTypes=data.allowedRelationTypes,
            allowedProperties=data.allowedProperties,
            allowedOperators=data.allowedOperators,
            maxHops=data.maxHops,
            createdBy=data.owner,
            createdAt=_now(),
        )
        self._rules[rule.id] = rule
        return rule

    def update(self, rule_id: str, data: RuleCreate) -> Optional[RuleDefinition]:
        rule = self._rules.get(rule_id)
        if not rule:
            return None
        updated = rule.model_copy(
            update={
                "name": data.name,
                "owner": data.owner,
                "description": data.description,
                "allowedTargetTypes": data.allowedTargetTypes,
                "allowedRelationTypes": data.allowedRelationTypes,
                "allowedProperties": data.allowedProperties,
                "allowedOperators": data.allowedOperators,
                "maxHops": data.maxHops,
                "version": rule.version + 1,
            }
        )
        self._rules[rule_id] = updated
        return updated

    def set_status(self, rule_id: str, status: str) -> Optional[RuleDefinition]:
        rule = self._rules.get(rule_id)
        if not rule:
            return None
        updated = rule.model_copy(update={"status": status})
        self._rules[rule_id] = updated
        return updated

    def delete(self, rule_id: str) -> bool:
        return self._rules.pop(rule_id, None) is not None


class PostgresRuleStore(RuleStore):
    """PostgreSQL 存储（psycopg3）。definition 以 JSONB 保存。"""

    _SCHEMA = """
    CREATE TABLE IF NOT EXISTS rules (
        id          TEXT PRIMARY KEY,
        name        TEXT NOT NULL,
        version     INT  NOT NULL DEFAULT 1,
        status      TEXT NOT NULL DEFAULT 'draft',
        owner       TEXT NOT NULL DEFAULT '',
        description TEXT NOT NULL DEFAULT '',
        definition  JSONB NOT NULL DEFAULT '{}',
        max_hops    INT  NOT NULL DEFAULT 5,
        created_at  TEXT NOT NULL DEFAULT ''
    )
    """

    def __init__(self, dsn: str) -> None:
        self._dsn = dsn

    def _connect(self):
        import psycopg

        return psycopg.connect(self._dsn)

    def ensure_ready(self) -> None:
        with self._connect() as conn:
            conn.execute(self._SCHEMA)
            conn.commit()

    def list(self) -> List[RuleDefinition]:
        with self._connect() as conn:
            rows = conn.execute(
                "SELECT id, name, version, status, owner, description, definition, max_hops, created_at FROM rules ORDER BY created_at"
            ).fetchall()
        return [self._row_to_rule(r) for r in rows]

    def get(self, rule_id: str) -> Optional[RuleDefinition]:
        with self._connect() as conn:
            row = conn.execute(
                "SELECT id, name, version, status, owner, description, definition, max_hops, created_at FROM rules WHERE id = %s",
                (rule_id,),
            ).fetchone()
        return self._row_to_rule(row) if row else None

    def create(self, data: RuleCreate) -> RuleDefinition:
        rule_id = data.name.replace(" ", "-").lower() or "rule"
        rule_id = f"{rule_id}-{int(time.time())}"
        with self._connect() as conn:
            conn.execute(
                """INSERT INTO rules
                   (id, name, version, status, owner, description, definition, max_hops, created_at)
                   VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                (
                    rule_id,
                    data.name,
                    1,
                    RuleStatus.DRAFT,
                    data.owner,
                    data.description,
                    data.model_dump_json(),
                    data.maxHops,
                    _now(),
                ),
            )
            conn.commit()
        rule = self.get(rule_id)
        assert rule is not None
        return rule

    def update(self, rule_id: str, data: RuleCreate) -> Optional[RuleDefinition]:
        existing = self.get(rule_id)
        if not existing:
            return None
        with self._connect() as conn:
            conn.execute(
                """UPDATE rules SET name=%s, owner=%s, description=%s, definition=%s,
                   max_hops=%s, version=%s WHERE id=%s""",
                (
                    data.name,
                    data.owner,
                    data.description,
                    data.model_dump_json(),
                    data.maxHops,
                    existing.version + 1,
                    rule_id,
                ),
            )
            conn.commit()
        return self.get(rule_id)

    def set_status(self, rule_id: str, status: str) -> Optional[RuleDefinition]:
        if not self.get(rule_id):
            return None
        with self._connect() as conn:
            conn.execute("UPDATE rules SET status=%s WHERE id=%s", (status, rule_id))
            conn.commit()
        return self.get(rule_id)

    def delete(self, rule_id: str) -> bool:
        with self._connect() as conn:
            cur = conn.execute("DELETE FROM rules WHERE id=%s", (rule_id,))
            conn.commit()
        return cur.rowcount > 0

    def _row_to_rule(self, row) -> RuleDefinition:
        import json

        definition = json.loads(row[6]) if isinstance(row[6], str) else (row[6] or {})
        base = {
            "id": row[0],
            "name": row[1],
            "version": row[2],
            "status": row[3],
            "owner": row[4],
            "description": row[5],
            "maxHops": row[7],
            "createdAt": row[8],
        }
        # definition 里含 allowed* 数组
        allowed = {
            "allowedTargetTypes": definition.get("allowedTargetTypes", []),
            "allowedRelationTypes": definition.get("allowedRelationTypes", []),
            "allowedProperties": definition.get("allowedProperties", []),
            "allowedOperators": definition.get("allowedOperators", []),
        }
        return RuleDefinition(**{**base, **allowed})


def create_store(backend: str) -> RuleStore:
    if backend == "postgres":
        return PostgresRuleStore(settings.pg_dsn)
    return InMemoryRuleStore()
