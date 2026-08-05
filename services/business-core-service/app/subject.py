"""主体属性解析：从 X-User-Context（网关注入）读取，含组织层级字段。

字段：tenantId / clearance / uid / roles / teams / orgPath / managerUid / subUids
"""

from __future__ import annotations

import json
from typing import Any, Dict

DEFAULT_SUBJECT: Dict[str, Any] = {
    "tenantId": "default",
    "clearance": 0,
    "uid": "anonymous",
    "roles": ["analyst"],
    "teams": [],
    "orgPath": "",
    "managerUid": "",
    "subUids": [],
}


def subject_from_request(request) -> Dict[str, Any]:
    """解析主体：优先 X-User-Context（网关注入），否则默认主体。"""
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
                    "orgPath": str(data.get("orgPath", "")),
                    "managerUid": str(data.get("managerUid", "")),
                    "subUids": list(data.get("subUids", [])),
                }
        except (json.JSONDecodeError, ValueError, TypeError):
            pass
    return dict(DEFAULT_SUBJECT)
