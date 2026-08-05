"""报表聚合 + 审计责任单元测试（MemoryStore）。"""

import pytest

from app import audit as audit_mod
from app import reports, tasks
from app.store import MemoryStore

BOSS = {
    "tenantId": "t1",
    "uid": "u-admin",
    "orgPath": "t1/ops",
    "managerUid": "",
    "subUids": ["u-analyst"],
}
ANALYST = {
    **BOSS,
    "uid": "u-analyst",
    "orgPath": "t1/ops/analysts",
    "managerUid": "u-admin",
    "subUids": [],
}


def test_report_create_and_run_scoped_by_org():
    store = MemoryStore()
    tasks.create_task(ANALYST, store, {"objectType": "c", "assigneeUid": "u-analyst"})
    tasks.create_task(ANALYST, store, {"objectType": "c", "assigneeUid": "u-analyst"})
    d = reports.create_definition(
        BOSS, store, {"name": "任务量", "dataset": "task", "groupBy": "status"}
    )
    result = reports.run(BOSS, store, d["id"])
    assert result["rows"] == [{"group": "todo", "count": 2}]


def test_report_rejects_bad_dataset_or_groupby():
    store = MemoryStore()
    with pytest.raises(reports.ReportError):
        reports.create_definition(BOSS, store, {"dataset": "nope", "groupBy": "status"})
    with pytest.raises(reports.ReportError):
        reports.create_definition(BOSS, store, {"dataset": "task", "groupBy": "nope"})


def test_report_run_missing_definition():
    with pytest.raises(reports.ReportError):
        reports.run(BOSS, MemoryStore(), "missing")


def test_audit_record_carries_responsible_upper():
    store = MemoryStore()
    evt = audit_mod.record(
        ANALYST,
        store,
        {
            "action": "import",
            "objectType": "import_task",
            "objectId": "t1",
            "payload": {"n": 3},
        },
    )
    assert evt["actorUid"] == "u-analyst"
    assert evt["responsibleUid"] == "u-admin"  # 责任上级 = managerUid
    assert evt["orgPath"] == "t1/ops/analysts"


def test_audit_search_scoped_by_org():
    store = MemoryStore()
    audit_mod.record(
        ANALYST,
        store,
        {"action": "import", "objectType": "import_task", "objectId": "t1"},
    )
    audit_mod.record(
        BOSS, store, {"action": "export", "objectType": "import_task", "objectId": "t1"}
    )
    # 上级能看到本组织（含下级）的审计
    rows = audit_mod.search(BOSS, store, {})
    assert len(rows) == 2
    # 按 action 过滤
    filtered = audit_mod.search(BOSS, store, {"action": "import"})
    assert len(filtered) == 1 and filtered[0]["actorUid"] == "u-analyst"
