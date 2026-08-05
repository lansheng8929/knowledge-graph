"""通用报表聚合：按维度统计（dataset: task|approval|audit），组织维度权限。"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List

from .scope import org_in_scope
from .store import Store

DATASETS = ("task", "approval", "audit")
GROUPABLE = ("assigneeUid", "orgPath", "status", "type", "objectType", "action")


class ReportError(ValueError):
    pass


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def create_definition(
    subject: Dict[str, Any], store: Store, req: Dict[str, Any]
) -> Dict[str, Any]:
    dataset = req.get("dataset", "")
    group_by = req.get("groupBy", "")
    if dataset not in DATASETS:
        raise ReportError(f"dataset must be one of {DATASETS}")
    if group_by not in GROUPABLE:
        raise ReportError(f"groupBy must be one of {GROUPABLE}")
    doc = {
        "id": uuid.uuid4().hex[:12],
        "name": req.get("name", ""),
        "dataset": dataset,
        "groupBy": group_by,
        "createdBy": subject.get("uid", ""),
        "tenantId": subject.get("tenantId", "default"),
        "createdAt": _now(),
    }
    store.put("report_definition", doc)
    return doc


def run(subject: Dict[str, Any], store: Store, def_id: str) -> Dict[str, Any]:
    d = store.get("report_definition", def_id)
    if d is None:
        raise ReportError("definition not found")

    def in_scope(row: Dict[str, Any]) -> bool:
        if row.get("tenantId") != subject.get("tenantId", "default"):
            return False
        return org_in_scope(subject, row.get("orgPath", ""))

    rows = [r for r in store.find(d["dataset"]) if in_scope(r)]
    groups: Dict[str, int] = {}
    for r in rows:
        key = r.get(d["groupBy"]) or "(empty)"
        groups[key] = groups.get(key, 0) + 1
    result = {
        "id": uuid.uuid4().hex[:12],
        "definitionId": def_id,
        "dataset": d["dataset"],
        "groupBy": d["groupBy"],
        "rows": [{"group": k, "count": v} for k, v in sorted(groups.items())],
        "generatedBy": subject.get("uid", ""),
        "generatedAt": _now(),
    }
    store.put("report_result", result)
    return result
