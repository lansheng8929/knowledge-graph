"""graph-rule-service 配置（env 化）。"""

import os
from dataclasses import dataclass

SERVICE_NAME = "graph-rule-service"


@dataclass(frozen=True)
class Settings:
    service_name: str = SERVICE_NAME
    service_version: str = os.getenv("SERVICE_VERSION", "0.1.0")

    # ── 存储后端：memory（默认，测试/开发）| postgres ──
    rule_store: str = os.getenv("RULE_STORE", "memory")

    # ── PostgreSQL（rule_store=postgres 时使用）────────
    pg_dsn: str = os.getenv(
        "PG_DSN",
        "postgresql://rule:rule@localhost:5432/rules",
    )

    # ── HTTP / CORS ────────────────────────────────────
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8002"))
    cors_origins: tuple = tuple(
        o.strip()
        for o in os.getenv(
            "CORS_ALLOW_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000",
        ).split(",")
        if o.strip()
    )

    # ── JWT（dev 直连兜底，与 auth 同密钥）──────────────
    auth_secret: str = os.getenv("AUTH_SECRET", "dev-secret-change-me")

    # ── ABAC L2（T4.5.1 Rule Service 接入，可选）───────
    enable_pep: bool = os.getenv("ENABLE_PEP", "false").lower() in (
        "1",
        "true",
        "yes",
    )
    opa_url: str = os.getenv("OPA_URL", "http://localhost:8181")

    # ── 审计 sink（T4.8 生产化）：log（默认）| file | postgres ──
    audit_sink: str = os.getenv("AUDIT_SINK", "log")
    audit_file: str = os.getenv("AUDIT_FILE", "")
    audit_dsn: str = os.getenv("AUDIT_DSN", "")


settings = Settings()
