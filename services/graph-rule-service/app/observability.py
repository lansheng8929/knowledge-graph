"""可观测性（T2.4.1 / T2.4.3 / T2.4.4）。

与 graph-query-service 的 observability 同构（服务名由调用方传入）。
"""

import json
import logging
import os
from datetime import datetime, timezone

# ── 结构化日志（T2.4.3）──────────────────────────────


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


def setup_logging(level: str = "INFO") -> None:
    handler = logging.StreamHandler()
    handler.setFormatter(JsonFormatter())
    root = logging.getLogger()
    root.handlers[:] = [handler]
    root.setLevel(level)


# ── OpenTelemetry Trace（T2.4.1）─────────────────────


def init_tracing(service_name: str) -> bool:
    endpoint = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "").strip()
    if not endpoint:
        return False
    try:
        from opentelemetry import trace
        from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
        from opentelemetry.sdk.resources import Resource
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.trace.export import BatchSpanProcessor
    except ImportError:
        logging.getLogger(__name__).warning("opentelemetry 未安装，跳过 tracing")
        return False

    provider = TracerProvider(
        resource=Resource.create({"service.name": service_name})
    )
    provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter(endpoint=endpoint)))
    trace.set_tracer_provider(provider)
    return True


def instrument_fastapi(app) -> None:
    try:
        from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

        FastAPIInstrumentor.instrument_app(app)
    except Exception as e:  # noqa: BLE001
        logging.getLogger(__name__).warning(f"instrument fastapi failed: {e}")


# ── 审计占位（T2.4.4）────────────────────────────────


def audit(
    subject: str,
    resource: str,
    action: str,
    decision: str,
    reason: str = "",
) -> None:
    """审计（T4.8）：经 audit-sink 持久化（log/file/postgres）；未安装时退回日志。"""
    from .config import settings  # 延迟导入避免循环

    record = {
        "subject": subject,
        "resource": resource,
        "action": action,
        "decision": decision,
        "reason": reason,
    }
    try:
        from audit_sink import create_sink

        create_sink(
            settings.audit_sink,
            file_path=settings.audit_file,
            dsn=settings.audit_dsn,
        ).emit(record)
    except Exception:  # noqa: BLE001（未安装/配置错误 → 保持仅日志，不阻断业务）
        logging.getLogger("audit").info(
            json.dumps(record, ensure_ascii=False, default=str)
        )
