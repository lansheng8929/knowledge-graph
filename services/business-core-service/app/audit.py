"""通用审计：事件落库 + 责任上级（managerUid），组织维度追溯。"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List

from .scope import org_in_scope
from .store import Store


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def record(
    subject: Dict[str, Any], store: Store, evt: Dict[str, Any]
) -> Dict[str, Any]:
    doc = {
        "id": uuid.uuid4().hex[:12],
        "tenantId": subject.get("tenantId", "default"),
        "actorUid": subject.get("uid", ""),
        "responsibleUid": subject.get("managerUid", ""),  # 责任上级
        "action": evt.get("action", ""),
        "objectType": evt.get("objectType", ""),
        "objectId": evt.get("objectId", ""),
        "payload": evt.get("payload", {}),
        "orgPath": subject.get("orgPath", ""),
        "at": _now(),
    }
    store.put("audit", doc)
    return doc


def search(
    subject: Dict[str, Any],
    store: Store,
    filters: Dict[str, Any],
) -> List[Dict[str, Any]]:
    def in_scope(e: Dict[str, Any]) -> bool:
        if e.get("tenantId") != subject.get("tenantId", "default"):
            return False
        # 本组织（含下级组织）产生的审计事件
        return org_in_scope(subject, e.get("orgPath", ""))

    rows = [e for e in store.find("audit") if in_scope(e)]
    if filters.get("objectType"):
        rows = [e for e in rows if e.get("objectType") == filters["objectType"]]
    if filters.get("objectId"):
        rows = [e for e in rows if e.get("objectId") == filters["objectId"]]
    if filters.get("action"):
        rows = [e for e in rows if e.get("action") == filters["action"]]
    rows.sort(key=lambda e: e.get("at", ""), reverse=True)
    return rows
