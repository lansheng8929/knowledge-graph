"""business-core-service 配置（env 化）。"""

import os
from dataclasses import dataclass

SERVICE_NAME = "business-core-service"


@dataclass(frozen=True)
class Settings:
    service_name: str = SERVICE_NAME
    service_version: str = os.getenv("SERVICE_VERSION", "0.1.0")

    # ── 存储（memory | postgres）─────────────────────
    store_kind: str = os.getenv("BUSINESS_CORE_STORE", "memory")
    pg_dsn: str = os.getenv("PG_DSN", "postgresql://kg:kg@localhost:5432/kg")

    # ── HTTP / CORS ────────────────────────────────────
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8006"))
    cors_origins: tuple = tuple(
        o.strip()
        for o in os.getenv(
            "CORS_ALLOW_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000",
        ).split(",")
        if o.strip()
    )


settings = Settings()
