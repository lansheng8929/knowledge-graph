"""通用任务分派：直接指派 / 按组织分派，业务无关。"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List

from .scope import uid_in_scope
from .store import Store

VALID_TASK_STATUS = ("todo", "doing", "done", "cancelled")


class TaskError(ValueError):
    pass


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def create_task(
    subject: Dict[str, Any], store: Store, req: Dict[str, Any]
) -> Dict[str, Any]:
    assignee = req.get("assigneeUid") or ""
    # 按组织分派：v1 简化为指派给该组织路径下的下级成员（无下级则派给本人）
    if not assignee and req.get("assignByOrg"):
        subs = subject.get("subUids", [])
        assignee = subs[0] if subs else subject.get("uid", "")
    doc = {
        "id": uuid.uuid4().hex[:12],
        "objectType": req.get("objectType", ""),
        "objectId": req.get("objectId", ""),
        "payload": req.get("payload", {}),
        "assigneeUid": assignee,
        "assignByOrg": req.get("assignByOrg", ""),
        "status": "todo",
        "dueAt": req.get("dueAt", ""),
        "createdBy": subject.get("uid", ""),
        "tenantId": subject.get("tenantId", "default"),
        "orgPath": subject.get("orgPath", ""),
        "createdAt": _now(),
        "updatedAt": _now(),
    }
    store.put("task", doc)
    return doc


def list_visible(
    subject: Dict[str, Any], store: Store, status: str = ""
) -> List[Dict[str, Any]]:
    """本人、下级或创建者可见。"""
    me = subject.get("uid")

    def vis(t: Dict[str, Any]) -> bool:
        if t.get("tenantId") != subject.get("tenantId", "default"):
            return False
        return (
            uid_in_scope(subject, t.get("assigneeUid", "")) or t.get("createdBy") == me
        )

    rows = [t for t in store.find("task") if vis(t)]
    if status:
        rows = [t for t in rows if t.get("status") == status]
    rows.sort(key=lambda t: t.get("createdAt", ""), reverse=True)
    return rows


def set_status(
    subject: Dict[str, Any], store: Store, tid: str, status: str
) -> Dict[str, Any]:
    if status not in VALID_TASK_STATUS:
        raise TaskError(f"status must be one of {VALID_TASK_STATUS}")
    doc = store.get("task", tid)
    if doc is None:
        raise TaskError("task not found")
    if not uid_in_scope(subject, doc.get("assigneeUid", "")):
        raise TaskError("not allowed to update this task")
    doc = dict(doc)
    doc["status"] = status
    doc["updatedAt"] = _now()
    store.put("task", doc)
    return doc
