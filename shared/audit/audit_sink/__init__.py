"""审计 sink 抽象（T4.8 生产化）。

把 PEP 决策/业务审计落到可靠存储，替代"仅日志"：
  - log：写独立 audit logger（默认，保持现状）
  - file：追加 JSONL 到指定文件（容器卷 / 对象存储挂载；不可覆盖追加）
  - postgres：INSERT 到 audit_log 表（可选，需 psycopg）

用法：
  from audit_sink import create_sink
  sink = create_sink(settings.audit_sink, file_path=..., dsn=...)
  sink.emit({"subject":..., "resource":..., "action":..., "decision":..., "reason":...})
"""

from .sink import (
    AuditSink,
    FileSink,
    LogSink,
    PostgresSink,
    create_sink,
)

__all__ = ["AuditSink", "LogSink", "FileSink", "PostgresSink", "create_sink"]
