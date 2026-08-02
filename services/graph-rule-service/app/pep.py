"""ABAC L2 PEP 集成（T4.5.1 Rule Service 接入）。

主体来源：网关经 X-User-Context 注入 JSON；未提供时用默认主体，保证现有请求不被误拦。
决策动作：rule_validate（见 policies/kg.rego action 白名单）。
"""

import json
import logging
from typing import Any, Dict

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
