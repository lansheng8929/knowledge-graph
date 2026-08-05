"""数据导入权限：根据登录主体（X-User-Context）计算可配置选项，并校验打标。

主体属性来源：网关经 X-User-Context 注入 JSON（与 graph-query-service/pep.py 同约定）；
未提供（如直接访问后端）时用默认主体，表示「无鉴权直连」，不拦截、不限制。

设计原则：
  - 密级（classification）：只能写到 ≤ 自己的 clearance；
  - 可见性（visibility）：不能标记高于自己密级的敏感档；
  - 租户（tenantId）：非 admin 只能写自己租户；
  - 属主（owner）：非 admin 只能归属自己（旧默认 "system"/空 自动替换为本人）。
"""

from __future__ import annotations

import json
import logging
from typing import Any, Dict, List, Tuple

from .config import settings
from .jwt import verify

logger = logging.getLogger(__name__)

# 与 validator 对齐
MAX_CLASSIFICATION = 3
VALID_VISIBILITY = {"public", "internal", "secret", "private"}
# 各可见性所需的最低密级（敏感档 "secret" 需 ≥2）
VISIBILITY_MIN_CLEARANCE = {
    "public": 0,
    "internal": 0,
    "secret": 2,
    "private": 0,
}
VISIBILITY_ORDER = ["public", "internal", "secret", "private"]

# 无鉴权直连时的默认主体（不限制任何选项）
DEFAULT_SUBJECT: Dict[str, Any] = {
    "username": "",
    "uid": "anonymous",
    "tenantId": "default",
    "clearance": MAX_CLASSIFICATION,
    "roles": ["admin", "analyst", "privileged"],
    "teams": [],
    "orgPath": "",
    "managerUid": "",
    "subUids": [],
}


def subject_from_header(raw: str) -> Dict[str, Any]:
    """解析 X-User-Context（JSON）；缺失/非法 → 默认主体（不拦截）。"""
    if not raw:
        return dict(DEFAULT_SUBJECT)
    try:
        data = json.loads(raw)
        if isinstance(data, dict):
            return {
                "username": str(data.get("username", data.get("sub", ""))),
                "uid": str(data.get("uid", data.get("sub", "anonymous"))),
                "tenantId": str(data.get("tenantId", "default")),
                "clearance": int(data.get("clearance", 0)),
                "roles": [str(r) for r in data.get("roles", [])],
                "teams": [str(t) for t in data.get("teams", [])],
                "orgPath": str(data.get("orgPath", "")),
                "managerUid": str(data.get("managerUid", "")),
                "subUids": [str(u) for u in data.get("subUids", [])],
            }
    except (json.JSONDecodeError, ValueError, TypeError):
        logger.warning("invalid X-User-Context header")
    return dict(DEFAULT_SUBJECT)


def _bearer_token(request) -> str:
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return auth[len("Bearer ") :].strip()
    return ""


def _subject_from_jwt(token: str) -> Dict[str, Any]:
    """dev 直连兜底：从 Authorization Bearer JWT 还原主体（签名校验）。"""
    payload = verify(token, settings.auth_secret)
    return {
        "username": str(payload.get("sub", "")),
        "uid": str(payload.get("uid", payload.get("sub", "anonymous"))),
        "tenantId": str(payload.get("tenantId", "default")),
        "clearance": int(payload.get("clearance", 0)),
        "roles": [str(r) for r in payload.get("roles", [])],
        "teams": [str(t) for t in payload.get("teams", [])],
        "orgPath": str(payload.get("orgPath", "")),
        "managerUid": str(payload.get("managerUid", "")),
        "subUids": [str(u) for u in payload.get("subUids", [])],
    }


def subject_from_request(request) -> Tuple[Dict[str, Any], bool]:
    """解析主体，返回 (subject, authenticated)。

    优先级：
      1. X-User-Context（网关 auth_request 注入，可信）→ authenticated=True
      2. Authorization Bearer JWT（dev 直连兜底，本地验签）→ authenticated=True
      3. 均缺失（无鉴权直连）→ 默认主体，authenticated=False（不限制）
    """
    raw = request.headers.get("X-User-Context", "")
    if raw:
        return subject_from_header(raw), True
    token = _bearer_token(request)
    if token:
        try:
            return _subject_from_jwt(token), True
        except (ValueError, KeyError, TypeError):
            logger.warning("invalid Authorization JWT; treat as unauthenticated")
    return dict(DEFAULT_SUBJECT), False


def _clearance(subject: Dict[str, Any]) -> int:
    try:
        return max(0, min(MAX_CLASSIFICATION, int(subject.get("clearance", 0))))
    except (TypeError, ValueError):
        return 0


def _is_admin(subject: Dict[str, Any]) -> bool:
    return "admin" in {str(r) for r in subject.get("roles", [])}


# ── 可配置项计算 ──────────────────────────────────────


def classification_max(subject: Dict[str, Any]) -> int:
    """本用户可写的最高密级 = 自己的 clearance（不超过全局上限）。"""
    return _clearance(subject)


def visibility_allowed(subject: Dict[str, Any]) -> List[str]:
    """本用户可选的可见性（敏感档需足够密级）。"""
    c = _clearance(subject)
    return [v for v in VISIBILITY_ORDER if VISIBILITY_MIN_CLEARANCE[v] <= c]


def can_set_tenant(subject: Dict[str, Any]) -> bool:
    """是否允许改数据归属租户（仅 admin）。"""
    return _is_admin(subject)


def can_set_owner(subject: Dict[str, Any]) -> bool:
    """是否允许把数据归属他人/部门（仅 admin）。"""
    return _is_admin(subject)


def import_options(subject: Dict[str, Any]) -> Dict[str, Any]:
    """/api/v1/import/options 响应：用户摘要 + 默认值 + 约束。"""
    username = subject.get("username", "")
    return {
        "user": {
            "username": username,
            "uid": subject.get("uid", ""),
            "tenantId": subject.get("tenantId", "default"),
            "clearance": _clearance(subject),
            "roles": list(subject.get("roles", [])),
            "teams": list(subject.get("teams", [])),
            "orgPath": subject.get("orgPath", ""),
        },
        "defaults": {
            "tenantId": subject.get("tenantId", "default"),
            "owner": username,
            "classification": 0,
            "visibility": "internal",
        },
        "constraints": {
            "classificationMax": classification_max(subject),
            "visibilityAllowed": visibility_allowed(subject),
            "nodeTypes": [
                "account",
                "address",
                "company",
                "device",
                "ip",
                "person",
                "phone",
            ],
            "canSetTenant": can_set_tenant(subject),
            "canSetOwner": can_set_owner(subject),
        },
    }


# ── 打标校验（写路径防绕过，仅真实鉴权主体时生效）──────


def check_tags_permitted(
    tags: Dict[str, Any], subject: Dict[str, Any], authenticated: bool
) -> List[str]:
    """校验打标是否越权；返回错误列表（空 = 放行）。

    authenticated=False（无鉴权直连）→ 不限制，保持原行为。
    """
    if not authenticated:
        return []
    errors: List[str] = []

    tenant = str(tags.get("tenantId", ""))
    if can_set_tenant(subject):
        pass
    elif tenant == "default" and subject.get("tenantId", "default") != "default":
        tags["tenantId"] = subject.get("tenantId", "default")  # 纠正旧默认
    elif tenant != subject.get("tenantId", "default"):
        errors.append(
            f"tenantId '{tenant}' not allowed (your tenant: "
            f"{subject.get('tenantId', 'default')})"
        )

    owner = str(tags.get("owner", ""))
    if can_set_owner(subject):
        pass
    elif owner in ("", "system"):
        tags["owner"] = subject.get("username", owner)  # 旧默认 → 归属本人
    elif owner != subject.get("username", owner):
        errors.append(
            f"owner '{owner}' not allowed (non-admin can only own data for self)"
        )

    try:
        cls = int(tags.get("classification", 0))
    except (TypeError, ValueError):
        cls = 0
    cmax = classification_max(subject)
    if cls > cmax:
        errors.append(f"classification {cls} exceeds your clearance {cmax}")

    vis = str(tags.get("visibility", ""))
    if vis not in visibility_allowed(subject):
        errors.append(
            f"visibility '{vis}' not allowed for you; allowed: "
            f"{visibility_allowed(subject)}"
        )

    return errors
