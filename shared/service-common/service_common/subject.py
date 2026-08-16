"""主体（Subject）解析 —— 平台统一实现（单一来源）。

来源优先级（网关 / dev 直连）：
  1. X-User-Context 头（网关注入，可信）
  2. Authorization: Bearer JWT（dev 直连兜底，本地验签；可选）
  3. 默认主体（无鉴权直连，不拦截）

服务间差异（默认 roles、是否启用 JWT 兜底）由调用方传参表达：
  - default：各服务的 DEFAULT_SUBJECT（含默认 roles）
  - secret：传 None 则不做 JWT 兜底（依赖网关注入的服务）
"""

from __future__ import annotations

import json
import logging
from typing import Any, Dict, Optional, Tuple

logger = logging.getLogger(__name__)

# 统一字段集（各服务按需消费；多余字段无害）
_FIELDS = (
    "username",
    "uid",
    "tenantId",
    "clearance",
    "roles",
    "teams",
    "orgPath",
    "managerUid",
    "subUids",
)


def subject_from_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    """JWT payload / 用户字典 → subject（字段映射统一在此）。"""
    return {
        "username": str(payload.get("username", payload.get("sub", ""))),
        "uid": str(payload.get("uid", payload.get("sub", "anonymous"))),
        "tenantId": str(payload.get("tenantId", "default")),
        "clearance": int(payload.get("clearance", 0)),
        "roles": [str(r) for r in payload.get("roles", [])],
        "teams": [str(t) for t in payload.get("teams", [])],
        "orgPath": str(payload.get("orgPath", "")),
        "managerUid": str(payload.get("managerUid", "")),
        "subUids": [str(u) for u in payload.get("subUids", [])],
    }


def subject_from_header(
    raw: str,
    default: Dict[str, Any],
    default_roles: Optional[list] = None,
) -> Dict[str, Any]:
    """解析 X-User-Context（JSON）；缺失/非法 → default 副本。

    header 缺 roles 时用 default_roles（≠ DEFAULT_SUBJECT 的 roles：
    header 缺失 ≠ 无鉴权直连，两个语义各服务可能不同）。
    """
    if not raw:
        return dict(default)
    try:
        data = json.loads(raw)
        if isinstance(data, dict):
            out = subject_from_payload(data)
            out["roles"] = list(data.get("roles", default_roles or []))
            return out
    except (json.JSONDecodeError, ValueError, TypeError):
        logger.warning("invalid X-User-Context header")
    return dict(default)


def subject_from_jwt(token: str, secret: str) -> Dict[str, Any]:
    """从 Bearer JWT 还原主体（签名校验；dev 直连兜底）。"""
    from .jwt import verify

    return subject_from_payload(verify(token, secret))


def subject_from_request(
    request,
    *,
    default: Dict[str, Any],
    secret: Optional[str] = None,
    default_roles: Optional[list] = None,
) -> Tuple[Dict[str, Any], bool]:
    """解析主体，返回 (subject, authenticated)。

    优先级：X-User-Context（可信）→ Bearer JWT（dev 直连，需 secret）→ 默认主体。
    """
    raw = request.headers.get("X-User-Context", "")
    if raw:
        return subject_from_header(raw, default, default_roles), True
    if secret:
        token = request.headers.get("Authorization", "")
        if token.startswith("Bearer "):
            token = token[len("Bearer ") :].strip()
            try:
                return subject_from_jwt(token, secret), True
            except (ValueError, KeyError, TypeError):
                logger.warning("invalid Authorization JWT; treat as unauthenticated")
    return dict(default), False
