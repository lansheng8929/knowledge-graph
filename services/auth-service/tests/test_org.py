"""org 组织层级工具单元测试（无外部依赖）。"""

from app.org import compute_sub_uids, org_path


def _users():
    return [
        {
            "username": "admin",
            "uid": "u-admin",
            "managerUid": "",
            "orgPath": "default/ops",
        },
        {
            "username": "analyst",
            "uid": "u-analyst",
            "managerUid": "u-admin",
            "orgPath": "default/ops/analysts",
        },
        {
            "username": "viewer",
            "uid": "u-viewer",
            "managerUid": "u-analyst",
            "orgPath": "default/ops/analysts/viewers",
        },
        {
            "username": "other",
            "uid": "u-other",
            "managerUid": "",
            "orgPath": "other-tenant",
        },
    ]


def test_sub_uids_direct_and_indirect():
    subs = compute_sub_uids(_users(), "u-admin")
    # 含直接（analyst）与间接（viewer）下级
    assert subs == ["u-analyst", "u-viewer"]


def test_sub_uids_mid_level():
    subs = compute_sub_uids(_users(), "u-analyst")
    assert subs == ["u-viewer"]


def test_sub_uids_leaf_and_unrelated():
    assert compute_sub_uids(_users(), "u-viewer") == []
    assert compute_sub_uids(_users(), "u-other") == []


def test_org_path_fallback():
    assert org_path({"orgPath": "default/ops"}, "") == "default/ops"
    assert org_path({}, "t1") == "t1"
