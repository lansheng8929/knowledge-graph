"""ABAC L2 PEP 集成（T4.5.1 Rule Service 接入）。

主体来源：网关经 X-User-Context 注入 JSON；未提供时用默认主体，保证现有请求不被误拦。
决策动作：rule_validate（见 policies/kg.rego action 白名单）。
"""

import logging
from typing import Any, Dict

from service_common.subject import subject_from_request as _subject_from_request

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
    """解析主体属性：优先 X-User-Context（网关注入），否则默认主体。
    （统一实现见 service_common.subject，单一来源）"""
    return _subject_from_request(
        request,
        default=DEFAULT_SUBJECT,
        default_roles=["analyst"],
    )[0]


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
