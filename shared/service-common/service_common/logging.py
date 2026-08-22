"""统一日志配置（全服务单一来源）。

- 默认 JSON 格式（Loki 采集）；`LOG_FORMAT=human` 时用 uvicorn 同款前缀格式（开发友好）。
- 级别由 `LOG_LEVEL` 控制（默认 INFO）。
"""

from __future__ import annotations

import json
import logging
import os
from datetime import datetime, timezone


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "ts": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "msg": record.getMessage(),
        }
        if record.exc_info:
            payload["exc"] = self.formatException(record.exc_info)
        return json.dumps(payload, ensure_ascii=False)


class LevelPrefixFormatter(logging.Formatter):
    """uvicorn 风格：`ERROR:   ` / `INFO:    ` 前缀对齐 8 字符。"""

    def format(self, record: logging.LogRecord) -> str:
        level = f"{record.levelname}:"
        record.__dict__["levelprefix"] = level + " " * (8 - len(level))
        return super().format(record)


def setup_logging(level: str = "", fmt: str = "") -> None:
    name = (level or os.getenv("LOG_LEVEL", "INFO")).upper()
    root = logging.getLogger()
    root.setLevel(getattr(logging, name, logging.INFO))
    handler = logging.StreamHandler()
    if (fmt or os.getenv("LOG_FORMAT", "json")).lower() == "human":
        handler.setFormatter(LevelPrefixFormatter(fmt="%(levelprefix)s %(message)s"))
    else:
        handler.setFormatter(JsonFormatter())
    root.handlers[:] = [handler]
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("neo4j").setLevel(logging.WARNING)

