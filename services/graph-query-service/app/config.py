"""服务配置（12-factor，全部 env 化）。

对应计划 T1.1.4：配置外置、连接池、超时、CORS 白名单、版本号。
生产环境 CORS 由 API Gateway 统一出口，此处仅放行开发来源。
"""

import os
from dataclasses import dataclass

SERVICE_NAME = "graph-query-service"


@dataclass(frozen=True)
class Settings:
    service_name: str = SERVICE_NAME
    service_version: str = os.getenv("SERVICE_VERSION", "0.1.0")

    # ── Neo4j ──────────────────────────────────────────
    neo4j_uri: str = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    neo4j_user: str = os.getenv("NEO4J_USER", "neo4j")
    neo4j_password: str = os.getenv("NEO4J_PASSWORD", "password123")

    # 连接池 / 超时（T1.1.5 连接健壮性）
    max_pool_size: int = int(os.getenv("NEO4J_MAX_POOL_SIZE", "50"))
    connection_acquisition_timeout: float = float(
        os.getenv("NEO4J_ACQUISITION_TIMEOUT", "60")
    )
    connection_timeout: float = float(os.getenv("NEO4J_CONNECTION_TIMEOUT", "30"))

    # ── HTTP ───────────────────────────────────────────
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8001"))

    # ── CORS（开发白名单；生产由网关统一出口）──────────
    cors_origins: tuple = tuple(
        o.strip()
        for o in os.getenv(
            "CORS_ALLOW_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000",
        ).split(",")
        if o.strip()
    )

    # ── Rule Service（T2.1.4；留空则跳过规则校验）──────
    rule_service_url: str = os.getenv("RULE_SERVICE_URL", "http://localhost:8002")

    # ── ABAC（T4.5 L2 / T4.6 L3）───────────────────────
    enable_pep: bool = os.getenv("ENABLE_PEP", "false").lower() in (
        "1",
        "true",
        "yes",
    )
    opa_url: str = os.getenv("OPA_URL", "http://localhost:8181")
    # dev 直连 JWT 兜底（与 auth-service 同密钥；无 X-User-Context 时从 Bearer 还原主体）
    auth_secret: str = os.getenv("AUTH_SECRET", "dev-secret-change-me")

    # ── 审计 sink（T4.8 生产化）：log（默认）| file | postgres ──
    audit_sink: str = os.getenv("AUDIT_SINK", "log")
    audit_file: str = os.getenv("AUDIT_FILE", "")
    audit_dsn: str = os.getenv("AUDIT_DSN", "")

    # ── 兼容旧路由（Strangler Fig：新路由稳定后关闭）──
    enable_legacy_routes: bool = os.getenv("ENABLE_LEGACY_ROUTES", "true").lower() in (
        "1",
        "true",
        "yes",
    )


settings = Settings()
