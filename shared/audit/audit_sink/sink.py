"""审计 sink 实现。

统一记录格式（保持 observability.audit 既有契约）：
  { subject, resource, action, decision, reason }
所有 sink 都额外写 audit logger，保证容器日志可见。
"""

import json
import logging
import os
import threading


class AuditSink:
    """审计写入接口。"""

    def emit(self, record: dict) -> None:
        raise NotImplementedError

    def _log(self, record: dict) -> None:
        logging.getLogger("audit").info(
            json.dumps(record, ensure_ascii=False, default=str)
        )


class LogSink(AuditSink):
    """默认：只写 audit logger（现状）。"""

    def emit(self, record: dict) -> None:
        self._log(record)


class FileSink(AuditSink):
    """追加 JSONL 到文件（线程安全）。"""

    def __init__(self, path: str) -> None:
        self._path = path
        self._lock = threading.Lock()

    def emit(self, record: dict) -> None:
        line = json.dumps(record, ensure_ascii=False, default=str)
        with self._lock:
            directory = os.path.dirname(self._path)
            if directory:
                os.makedirs(directory, exist_ok=True)
            with open(self._path, "a", encoding="utf-8") as f:
                f.write(line + "\n")
        self._log(record)


class PostgresSink(AuditSink):
    """写 PostgreSQL audit_log 表（需 psycopg）。"""

    def __init__(self, dsn: str) -> None:
        import psycopg

        self._dsn = dsn
        with psycopg.connect(dsn) as conn:
            conn.execute(
                """CREATE TABLE IF NOT EXISTS audit_log (
                    id BIGSERIAL PRIMARY KEY,
                    ts TIMESTAMPTZ DEFAULT now(),
                    subject TEXT,
                    resource TEXT,
                    action TEXT,
                    decision TEXT,
                    reason TEXT,
                    detail JSONB
                )"""
            )

    def emit(self, record: dict) -> None:
        import psycopg

        with psycopg.connect(self._dsn) as conn:
            conn.execute(
                """INSERT INTO audit_log
                   (subject, resource, action, decision, reason, detail)
                   VALUES (%s,%s,%s,%s,%s,%s)""",
                (
                    str(record.get("subject", "")),
                    str(record.get("resource", "")),
                    str(record.get("action", "")),
                    str(record.get("decision", "")),
                    str(record.get("reason", "")),
                    json.dumps(record, ensure_ascii=False, default=str),
                ),
            )
        self._log(record)


def create_sink(kind: str = "log", file_path: str = "", dsn: str = "") -> AuditSink:
    """工厂：log（默认）| file | postgres；未知回退 log。"""
    if kind == "file":
        if not file_path:
            raise ValueError("AUDIT_FILE required for file sink")
        return FileSink(file_path)
    if kind == "postgres":
        if not dsn:
            raise ValueError("AUDIT_DSN required for postgres sink")
        return PostgresSink(dsn)
    return LogSink()
