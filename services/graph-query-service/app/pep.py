"""ABAC PEP 集成（T4.5 L2 服务级 / T4.6 L3 数据级）。

主体属性来源：网关经 X-User-Context 注入 JSON（Phase 4 IDP 后），未提供时用默认主体
（tenantId=default, clearance=0, anonymous），保证现有无鉴权请求不被误拦截。
"""

import logging
from typing import Any, Dict, Optional, Tuple

from service_common.subject import subject_from_request

from .config import settings

logger = logging.getLogger(__name__)

DEFAULT_SUBJECT: Dict[str, Any] = {
    "username": "",
    "tenantId": "default",
    "clearance": 0,
    "uid": "anonymous",
    "roles": ["analyst"],
    "teams": [],
    "orgPath": "",
    "subUids": [],
}


def subject_from_request(request) -> Dict[str, Any]:
    """解析主体属性（统一实现见 service_common.subject，单一来源）。"""
    return subject_from_request(
        request,
        default=DEFAULT_SUBJECT,
        secret=settings.auth_secret,
        default_roles=["analyst"],
    )[0]


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
        # owner 为空时恒 False：无属主数据不匹配任何人（空 owner == 空 username 的
        # 误放行漏洞修复——private/internal 无属主数据不可见）
        return bool(owner) and (owner == uid or owner == username or owner_uid == uid)

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
