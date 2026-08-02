"""服务配置（12-factor，全部 env 化）。"""

import os
from dataclasses import dataclass

SERVICE_NAME = "auth-service"


@dataclass(frozen=True)
class Settings:
    service_name: str = SERVICE_NAME
    service_version: str = os.getenv("SERVICE_VERSION", "0.1.0")

    # ── JWT（HMAC-SHA256）─────────────────────────────
    # 生产必须由 Secret 注入（K8s Secret / Vault）；默认值仅本地演示
    auth_secret: str = os.getenv("AUTH_SECRET", "dev-secret-change-me")
    token_ttl_seconds: int = int(os.getenv("TOKEN_TTL_SECONDS", "3600"))

    # ── 用户存储（T4.1 完善）：memory（默认）| postgres ──
    user_store: str = os.getenv("USER_STORE", "memory")
    auth_db_dsn: str = os.getenv(
        "AUTH_DB_DSN", "postgresql://auth:auth@localhost:5432/auth"
    )
    # 初始管理员密码（仅 bootstrap；生产由 Secret 注入，留空=不创建）
    bootstrap_admin_password: str = os.getenv("AUTH_BOOTSTRAP_ADMIN_PASSWORD", "")

    # ── HTTP ───────────────────────────────────────────
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8004"))

    # ── CORS（开发白名单；生产由网关统一出口）──────────
    cors_origins: tuple = tuple(
        o.strip()
        for o in os.getenv(
            "CORS_ALLOW_ORIGINS",
            "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001",
        ).split(",")
        if o.strip()
    )


settings = Settings()
