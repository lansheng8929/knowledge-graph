"""ABAC PEP 集成（T4.5 L2 服务级 / T4.6 L3 数据级）。

主体属性来源：网关经 X-User-Context 注入 JSON（Phase 4 IDP 后），未提供时用默认主体
（tenantId=default, clearance=0, anonymous），保证现有无鉴权请求不被误拦截。
"""

import json
import logging
from typing import Any, Dict, Optional, Tuple

from .config import settings

logger = logging.getLogger(__name__)

DEFAULT_SUBJECT: Dict[str, Any] = {
    "tenantId": "default",
    "clearance": 0,
    "uid": "anonymous",
    "roles": ["analyst"],
    "teams": [],
}


def subject_from_request(request) -> Dict[str, Any]:
    """解析主体属性：优先 X-User-Context（网关注入），否则默认主体。"""
    raw = request.headers.get("X-User-Context", "")
    if raw:
        try:
            data = json.loads(raw)
            if isinstance(data, dict):
                return {
                    "tenantId": str(data.get("tenantId", "default")),
                    "clearance": int(data.get("clearance", 0)),
                    "uid": str(data.get("uid", "anonymous")),
                    "roles": list(data.get("roles", ["analyst"])),
                    "teams": list(data.get("teams", [])),
                }
        except (json.JSONDecodeError, ValueError, TypeError):
            logger.warning("invalid X-User-Context header")
    return dict(DEFAULT_SUBJECT)


def l3_conditions(subject: Dict[str, Any], alias: str = "n") -> Tuple[str, Dict[str, Any]]:
    """L3 数据级过滤（宽松渐进）：未打标数据放行，打标数据严格按租户+密级过滤。"""
    t = subject.get("tenantId", "default")
    c = int(subject.get("clearance", 0))
    where = (
        f"({alias}.tenantId IS NULL OR {alias}.tenantId = $subject_tenantId)"
        f" AND ({alias}.classification IS NULL OR {alias}.classification <= $subject_clearance)"
    )
    params = {"subject_tenantId": t, "subject_clearance": c}
    return where, params


def l3_visible(
    node_data: Dict[str, Any], subject: Optional[Dict[str, Any]]
) -> bool:
    """L3 投影过滤（返回后内存裁剪，双保险）：与 Cypher 宽松过滤同谓词。

    未打标数据（tenantId/classification 为空）放行，打标数据严格按租户+密级，
    防止跨租户/低密级侧信道。
    """
    if not subject:
        return True
    t = subject.get("tenantId", "default")
    try:
        c = int(subject.get("clearance", 0))
    except (TypeError, ValueError):
        c = 0
    node_tenant = node_data.get("tenantId")
    if node_tenant is not None and str(node_tenant) != str(t):
        return False
    cls = node_data.get("classification")
    if cls is not None:
        try:
            if int(cls) > c:
                return False
        except (TypeError, ValueError):
            return False
    return True


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
