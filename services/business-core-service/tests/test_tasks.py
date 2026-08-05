"""任务分派单元测试（MemoryStore）。"""

import pytest

from app import tasks
from app.store import MemoryStore

BOSS = {
    "tenantId": "t1",
    "uid": "u-admin",
    "orgPath": "t1/ops",
    "managerUid": "",
    "subUids": ["u-analyst", "u-viewer"],
}
ANALYST = {
    **BOSS,
    "uid": "u-analyst",
    "orgPath": "t1/ops/analysts",
    "managerUid": "u-admin",
    "subUids": ["u-viewer"],
}


def test_create_direct_assign():
    store = MemoryStore()
    t = tasks.create_task(
        BOSS,
        store,
        {"objectType": "case", "objectId": "c1", "assigneeUid": "u-analyst"},
    )
    assert t["assigneeUid"] == "u-analyst"
    assert t["status"] == "todo"


def test_create_assign_by_org_picks_subordinate():
    store = MemoryStore()
    t = tasks.create_task(BOSS, store, {"assignByOrg": "t1/ops/analysts"})
    assert t["assigneeUid"] in BOSS["subUids"]


def test_list_visible_includes_subordinates():
    store = MemoryStore()
    tasks.create_task(BOSS, store, {"assigneeUid": "u-analyst"})
    rows = tasks.list_visible(ANALYST, store)  # analyst 可见自己 + 下级(viewer)
    assert len(rows) == 1  # analyst 是 assignee
    rows2 = tasks.list_visible(BOSS, store)
    assert len(rows2) == 1  # boss 可见下级任务


def test_set_status_only_assignee_or_scope():
    store = MemoryStore()
    t = tasks.create_task(BOSS, store, {"assigneeUid": "u-viewer"})
    with pytest.raises(tasks.TaskError):
        tasks.set_status(
            {**ANALYST, "uid": "u-stranger", "subUids": []}, store, t["id"], "done"
        )
    # 上级可更新下级任务
    doc = tasks.set_status(ANALYST, store, t["id"], "doing")
    assert doc["status"] == "doing"


def test_invalid_status():
    store = MemoryStore()
    t = tasks.create_task(BOSS, store, {"assigneeUid": "u-viewer"})
    with pytest.raises(tasks.TaskError):
        tasks.set_status(BOSS, store, t["id"], "flying")
