"""graph-ingestion 配置（env 化）。"""

import os
from dataclasses import dataclass

SERVICE_NAME = "graph-ingestion"


@dataclass(frozen=True)
class Settings:
    service_name: str = SERVICE_NAME
    service_version: str = os.getenv("SERVICE_VERSION", "0.1.0")

    # ── Neo4j ──────────────────────────────────────────
    neo4j_uri: str = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    neo4j_user: str = os.getenv("NEO4J_USER", "neo4j")
    neo4j_password: str = os.getenv("NEO4J_PASSWORD", "password123")
    max_pool_size: int = int(os.getenv("NEO4J_MAX_POOL_SIZE", "50"))

    # ── HTTP / CORS ────────────────────────────────────
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8003"))
    cors_origins: tuple = tuple(
        o.strip()
        for o in os.getenv(
            "CORS_ALLOW_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000",
        ).split(",")
        if o.strip()
    )


settings = Settings()
