"""通用审批流：状态机 + 自动路由（approvers 空 → 申请人 managerUid），业务无关。"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List

from .store import Store

VALID_STATUS = ("pending", "in_review", "approved", "rejected")
ACTIONS = ("approve", "reject", "comment")


class ApprovalError(ValueError):
    pass


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def create_request(
    subject: Dict[str, Any], store: Store, req: Dict[str, Any]
) -> Dict[str, Any]:
    applicant = subject.get("uid", "anonymous")
    approver = (req.get("approvers") or [None])[0] or subject.get("managerUid")
    if not approver:
        raise ApprovalError(
            "no approver: 未指定审批人且无法按组织层级自动路由（无上级）"
        )
    doc = {
        "id": uuid.uuid4().hex[:12],
        "type": req.get("type", "default"),
        "objectType": req.get("objectType", ""),
        "objectId": req.get("objectId", ""),
        "payload": req.get("payload", {}),
        "applicantUid": applicant,
        "approverUid": approver,
        "status": "pending",
        "records": [
            {"action": "submit", "actorUid": applicant, "comment": "", "at": _now()}
        ],
        "tenantId": subject.get("tenantId", "default"),
        "orgPath": subject.get("orgPath", ""),
        "createdAt": _now(),
        "updatedAt": _now(),
    }
    store.put("approval", doc)
    return doc


def act(
    subject: Dict[str, Any],
    store: Store,
    rid: str,
    action: str,
    comment: str = "",
) -> Dict[str, Any]:
    if action not in ACTIONS:
        raise ApprovalError(f"action must be one of {ACTIONS}")
    doc = store.get("approval", rid)
    if doc is None:
        raise ApprovalError("approval not found")
    actor = subject.get("uid", "")
    if action in ("approve", "reject"):
        if actor != doc.get("approverUid"):
            raise ApprovalError("only the approver can approve/reject")
        if doc.get("status") in ("approved", "rejected"):
            raise ApprovalError("already decided")
    doc = dict(doc)
    doc["records"] = list(doc.get("records", []))
    doc["records"].append(
        {"action": action, "actorUid": actor, "comment": comment or "", "at": _now()}
    )
    if action == "approve":
        doc["status"] = "approved"
    elif action == "reject":
        doc["status"] = "rejected"
    elif action == "comment":
        if doc["status"] == "pending":
            doc["status"] = "in_review"
    doc["updatedAt"] = _now()
    store.put("approval", doc)
    return doc


def list_for_subject(
    subject: Dict[str, Any], store: Store, status: str = ""
) -> List[Dict[str, Any]]:
    """申请人本人 或 审批人本人 相关的审批单。"""
    me = subject.get("uid")
    rows = [
        d
        for d in store.find("approval")
        if d.get("tenantId") == subject.get("tenantId", "default")
        and (d.get("applicantUid") == me or d.get("approverUid") == me)
    ]
    if status:
        rows = [d for d in rows if d.get("status") == status]
    rows.sort(key=lambda d: d.get("createdAt", ""), reverse=True)
    return rows
