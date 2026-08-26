"""filter_schema 表结构 + psycopg 连接辅助。"""
from __future__ import annotations

import time
from typing import Optional

import psycopg
from psycopg.rows import dict_row

DDL = """
CREATE TABLE IF NOT EXISTS filter_schema (
  id          SERIAL PRIMARY KEY,
  type_kind   TEXT NOT NULL CHECK (type_kind IN ('node', 'edge')),
  type_name   TEXT NOT NULL,
  attr_key    TEXT NOT NULL,
  filter_type TEXT NOT NULL CHECK (filter_type IN ('text','select','number_range','date_range','bool','region')),
  label       TEXT NOT NULL,
  unit        TEXT NOT NULL DEFAULT '',
  options     JSONB NOT NULL DEFAULT '[]',
  sort_order  INT  NOT NULL DEFAULT 0,
  enabled     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (type_kind, type_name, attr_key)
);
"""


def connect(dsn: str):
    """带线性退避的 psycopg 连接（与其它服务同模式）。"""
    last: Optional[Exception] = None
    for attempt in range(8):
        try:
            return psycopg.connect(dsn, row_factory=dict_row)
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(min(0.5 * (attempt + 1), 4))
    raise last  # type: ignore


def ensure_schema(dsn: str) -> None:
    with connect(dsn) as conn:
        conn.execute(DDL)
        # 迁移：已有库的 CHECK 约束不含 region → 重建（幂等）
        conn.execute(
            "ALTER TABLE filter_schema DROP CONSTRAINT IF EXISTS "
            "filter_schema_filter_type_check"
        )
        conn.execute(
            "ALTER TABLE filter_schema ADD CONSTRAINT filter_schema_filter_type_check "
            "CHECK (filter_type IN "
            "('text','select','number_range','date_range','bool','region'))"
        )
        conn.commit()
