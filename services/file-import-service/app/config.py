"""file-import-service 配置（env 化）。"""

import os
from dataclasses import dataclass

SERVICE_NAME = "file-import-service"


@dataclass(frozen=True)
class Settings:
    service_name: str = SERVICE_NAME
    service_version: str = os.getenv("SERVICE_VERSION", "0.1.0")

    # ── graph-ingestion 写入口（唯一写通道）────────────
    ingestion_base_url: str = os.getenv("INGESTION_BASE_URL", "http://localhost:8003")

    # ── 主体鉴权（dev 直连兜底：无网关 X-User-Context 时校验 JWT）──
    # 与 auth-service 的 AUTH_SECRET 保持一致
    auth_secret: str = os.getenv("AUTH_SECRET", "dev-secret-change-me")

    # ── 任务存储（P2 落库：memory | postgres）─────────
    # postgres：任务/历史持久化到 import_tasks 表（重启不丢、多 worker 一致）
    task_store: str = os.getenv("TASK_STORE", "memory")
    pg_dsn: str = os.getenv("PG_DSN", "postgresql://kg:kg@localhost:5432/kg")

    # ── 导入限制 ──────────────────────────────────────
    max_file_bytes: int = int(os.getenv("MAX_FILE_BYTES", str(50 * 1024 * 1024)))
    preview_limit: int = int(os.getenv("PREVIEW_LIMIT", "20"))
    write_chunk: int = int(os.getenv("WRITE_CHUNK", "500"))

    # ── HTTP / CORS ────────────────────────────────────
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8005"))
    cors_origins: tuple = tuple(
        o.strip()
        for o in os.getenv(
            "CORS_ALLOW_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000",
        ).split(",")
        if o.strip()
    )


settings = Settings()
