"""审批流单元测试（MemoryStore）。"""

import pytest

from app import approval
from app.store import MemoryStore

SUB = {
    "tenantId": "t1",
    "uid": "u-analyst",
    "orgPath": "t1/ops/analysts",
    "managerUid": "u-admin",
    "subUids": [],
}
BOSS = {**SUB, "uid": "u-admin", "managerUid": ""}


def test_create_auto_routes_to_manager():
    store = MemoryStore()
    req = {
        "type": "import_approval",
        "objectType": "import_task",
        "objectId": "t1",
        "payload": {"n": 4},
    }
    doc = approval.create_request(SUB, store, req)
    assert doc["approverUid"] == "u-admin"
    assert doc["status"] == "pending"
    assert doc["applicantUid"] == "u-analyst"


def test_create_with_explicit_approver():
    store = MemoryStore()
    doc = approval.create_request(SUB, store, {"approvers": ["u-other"]})
    assert doc["approverUid"] == "u-other"


def test_create_no_approver_fails():
    store = MemoryStore()
    with pytest.raises(approval.ApprovalError):
        approval.create_request({**SUB, "managerUid": ""}, store, {})


def test_approve_reject_state_machine():
    store = MemoryStore()
    doc = approval.create_request(SUB, store, {})
    rid = doc["id"]
    # 申请人不能批
    with pytest.raises(approval.ApprovalError):
        approval.act(SUB, store, rid, "approve")
    doc = approval.act(BOSS, store, rid, "approve")
    assert doc["status"] == "approved"
    # 已决不能再批
    with pytest.raises(approval.ApprovalError):
        approval.act(BOSS, store, rid, "reject")


def test_comment_moves_to_in_review():
    store = MemoryStore()
    doc = approval.create_request(SUB, store, {})
    doc = approval.act(SUB, store, doc["id"], "comment", "补充材料")
    assert doc["status"] == "in_review"
    assert doc["records"][-1]["comment"] == "补充材料"


def test_list_for_subject():
    store = MemoryStore()
    approval.create_request(SUB, store, {})  # applicant = analyst
    approval.create_request(
        BOSS, store, {"objectType": "x", "approvers": ["u-analyst"]}
    )
    mine = approval.list_for_subject(SUB, store)
    assert len(mine) == 2  # 申请人 + 审批人身份各一条
    pending = approval.list_for_subject(SUB, store, "pending")
    assert all(d["status"] == "pending" for d in pending)
