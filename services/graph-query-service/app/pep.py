"""ABAC PEP 集成（T4.5 L2 服务级 / T4.6 L3 数据级）。

主体属性来源：网关经 X-User-Context 注入 JSON（Phase 4 IDP 后），未提供时用默认主体
（tenantId=default, clearance=0, anonymous），保证现有无鉴权请求不被误拦截。
"""

import json
import logging
from typing import Any, Dict, Optional, Tuple

from .config import settings
from .jwt import verify

logger = logging.getLogger(__name__)

DEFAULT_SUBJECT: Dict[str, Any] = {
    "username": "",
    "tenantId": "default",
    "clearance": 0,
    "uid": "anonymous",
    "roles": ["analyst"],
    "teams": [],
    "subUids": [],
}


def subject_from_header(raw: str) -> Dict[str, Any]:
    """解析 X-User-Context（JSON）；缺失/非法 → 默认主体。"""
    if not raw:
        return dict(DEFAULT_SUBJECT)
    try:
        data = json.loads(raw)
        if isinstance(data, dict):
            return {
                "username": str(data.get("username", data.get("sub", ""))),
                "tenantId": str(data.get("tenantId", "default")),
                "clearance": int(data.get("clearance", 0)),
                "uid": str(data.get("uid", "anonymous")),
                "roles": list(data.get("roles", ["analyst"])),
                "teams": list(data.get("teams", [])),
                "orgPath": str(data.get("orgPath", "")),
                "subUids": list(data.get("subUids", [])),
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
        "tenantId": str(payload.get("tenantId", "default")),
        "clearance": int(payload.get("clearance", 0)),
        "uid": str(payload.get("uid", payload.get("sub", "anonymous"))),
        "roles": [str(r) for r in payload.get("roles", [])],
        "teams": [str(t) for t in payload.get("teams", [])],
        "orgPath": str(payload.get("orgPath", "")),
        "subUids": [str(u) for u in payload.get("subUids", [])],
    }


def subject_from_request(request) -> Dict[str, Any]:
    """解析主体属性：
    1. X-User-Context（网关注入，可信）；
    2. Authorization Bearer JWT（dev 直连兜底，本地验签）；
    3. 均缺失 → 默认主体（无鉴权直连）。
    """
    raw = request.headers.get("X-User-Context", "")
    if raw:
        return subject_from_header(raw)
    token = _bearer_token(request)
    if token:
        try:
            return _subject_from_jwt(token)
        except (ValueError, KeyError, TypeError):
            logger.warning("invalid Authorization JWT; treat as default subject")
    return dict(DEFAULT_SUBJECT)


def l3_conditions(
    subject: Dict[str, Any], alias: str = "n"
) -> Tuple[str, Dict[str, Any]]:
    """L3 数据级过滤（可见性只管可见，密级不参与）：未打标放行；打标只按
    租户 + 可见性分层。

    可见性分层（2026-08-06 统一）：
      - public    同租户全员可见
      - internal  自己及下级（owner/ownerUid 匹配 uid/username/subUids）
      - private   仅自己
      - secret    存量兼容 → 按 internal 处理
    密级 classification 只驱动 L4 脱敏（见 masking.py）。
    """
    t = subject.get("tenantId", "default")
    uid = subject.get("uid", "")
    # 属主标识：既认 uid 也认 username（import 默认打标 owner=用户名）
    username = subject.get("username", "")
    sub_uids = list(subject.get("subUids", []))
    where = (
        f"({alias}.tenantId IS NULL OR {alias}.tenantId = $subject_tenantId)"
        f" AND ("
        f"   {alias}.visibility IS NULL"
        f"   OR {alias}.visibility = 'public'"
        f"   OR (({alias}.visibility = 'private') AND ("
        f"       {alias}.owner = $subject_uid"
        f"       OR {alias}.owner = $subject_username"
        f"       OR {alias}.ownerUid = $subject_uid))"
        f"   OR (({alias}.visibility = 'internal' OR {alias}.visibility = 'secret') AND ("
        f"       {alias}.owner = $subject_uid"
        f"       OR {alias}.owner = $subject_username"
        f"       OR {alias}.ownerUid = $subject_uid"
        f"       OR {alias}.ownerUid IN $subject_subUids"
        f"       OR {alias}.owner IN $subject_subUids))"
        f")"
    )
    params = {
        "subject_tenantId": t,
        "subject_uid": uid,
        "subject_username": username,
        "subject_subUids": sub_uids,
    }
    return where, params


def l3_visible(node_data: Dict[str, Any], subject: Optional[Dict[str, Any]]) -> bool:
    """L3 投影过滤（返回后内存裁剪，双保险）：与 Cypher 宽松过滤同谓词。

    可见性只管可见（租户 + 分层），密级不参与（只驱动 L4 脱敏）。
    """
    if not subject:
        return True
    t = subject.get("tenantId", "default")
    uid = str(subject.get("uid", ""))
    username = str(subject.get("username", ""))
    sub_uids = {str(x) for x in subject.get("subUids", [])}
    node_tenant = node_data.get("tenantId")
    if node_tenant is not None and str(node_tenant) != str(t):
        return False
    vis = node_data.get("visibility")
    if vis is None:
        return True
    vs = str(vis)
    if vs == "public":
        return True
    owner = str(node_data.get("owner", "")) if node_data.get("owner") else ""
    owner_uid = str(node_data.get("ownerUid", "")) if node_data.get("ownerUid") else ""

    def self_ok() -> bool:
        return owner == uid or owner == username or owner_uid == uid

    if vs == "private":
        return self_ok()
    if vs in ("internal", "secret"):  # secret 存量兼容
        if self_ok() or owner_uid in sub_uids or owner in sub_uids:
            return True
        return False
    # 未知可见性档位：安全默认拒绝
    return False


_pep = None


def get_pep():
    """L2 授权客户端（可选；ENABLE_PEP 未开或 pep-client 未装时返回 None）。"""
    global _pep
    if _pep is not None:
        return _pep
    if not settings.enable_pep:
        _pep = None
        return None
    try:
        from pep_client import PepClient

        _pep = PepClient(settings.opa_url)
    except Exception as e:  # noqa: BLE001
        logger.warning(f"pep-client 不可用，L2 授权跳过: {e}")
        _pep = None
    return _pep
