"""环境变量访问（统一入口，docs/agent-plan.md §11.2）。

约定：全仓文件直接 `from .config import get_env...` 获取环境变量，
不建 Settings 单例、不注入参数；类型化取值用 get_env_int/float/bool/list。
"""

import os
from typing import Any

SERVICE_NAME = "agent-service"
SERVICE_VERSION = os.getenv("SERVICE_VERSION", "0.1.0")
DEFAULT_CORS_ORIGINS = ("http://localhost:3000", "http://127.0.0.1:3000")


def get_env(name: str, default: str = "") -> str:
    """取环境变量；未设置返回 default。"""
    return os.getenv(name, default)


def get_env_int(name: str, default: int) -> int:
    """取整型环境变量；非法值回退 default。"""
    try:
        return int(os.getenv(name, str(default)))
    except (TypeError, ValueError):
        return default


def get_env_float(name: str, default: float) -> float:
    """取浮点环境变量；非法值回退 default。"""
    try:
        return float(os.getenv(name, str(default)))
    except (TypeError, ValueError):
        return default


def get_env_bool(name: str, default: bool) -> bool:
    """取布尔环境变量（1/true/yes 视为真）。"""
    return os.getenv(name, str(default)).lower() in ("1", "true", "yes")


def get_env_list(name: str, default: tuple[Any, ...] = ()) -> tuple[Any, ...]:
    """取逗号分隔列表环境变量；未设置返回 default。"""
    raw = os.getenv(name, "")
    if not raw:
        return tuple(default)
    return tuple(o.strip() for o in raw.split(",") if o.strip())
