"""L3 数据级过滤单元测试（仅本人 / 团队 / 上级看下级 / 密级 / 租户）。"""

import pytest

from app.pep import DEFAULT_SUBJECT, l3_conditions, l3_visible

SUBJECT = {
    "tenantId": "t1",
    "clearance": 2,
    "uid": "u-a",
    "teams": ["team-x"],
    "subUids": ["u-b", "u-c"],
}


def test_owner_only_self_sees():
    data = {
        "tenantId": "t1",
        "classification": 1,
        "visibility": "private",
        "owner": "u-a",
    }
    assert l3_visible(data, SUBJECT) is True
    other = {**SUBJECT, "uid": "u-other"}
    assert l3_visible(data, other) is False


def test_team_member_sees():
    data = {
        "tenantId": "t1",
        "classification": 1,
        "visibility": "internal",
        "owner": "u-owner",
    }
    member = {**SUBJECT, "uid": "u-owner"}  # owner
    assert l3_visible(data, member) is True
    # 团队规则：owner 在 subject.teams 里（u-owner 属于 team-x）
    team_data = {**data, "owner": "u-owner"}
    team_subject = {**SUBJECT, "uid": "u-team", "teams": ["team-x", "u-owner"]}
    assert l3_visible(team_data, team_subject) is True


def test_superior_sees_subordinate():
    # 上级（u-a）可看下级（u-b）的数据
    data = {
        "tenantId": "t1",
        "classification": 1,
        "visibility": "internal",
        "owner": "u-b",
    }
    assert l3_visible(data, SUBJECT) is True
    # 非上级不可见
    outsider = {**SUBJECT, "uid": "u-z", "subUids": []}
    assert l3_visible(data, outsider) is False


def test_clearance_blocks():
    data = {
        "tenantId": "t1",
        "classification": 3,
        "visibility": "public",
        "owner": "u-b",
    }
    low = {**SUBJECT, "clearance": 1}
    assert l3_visible(data, low) is False


def test_tenant_blocks():
    data = {"tenantId": "t2", "classification": 1, "visibility": "public"}
    assert l3_visible(data, SUBJECT) is False


def test_untagged_released():
    assert l3_visible({}, SUBJECT) is True


def test_l3_conditions_include_owner_visibility():
    where, params = l3_conditions(SUBJECT)
    assert "owner = $subject_uid" in where
    assert "owner IN $subject_teams" in where
    assert "owner IN $subject_subUids" in where
    assert params["subject_uid"] == "u-a"
    assert params["subject_subUids"] == ["u-b", "u-c"]


def test_default_subject_has_subuids():
    assert DEFAULT_SUBJECT["subUids"] == []


# ── 可见性分层（2026-08-05 精细化）────────────────────


def test_private_only_owner_sees():
    data = {
        "tenantId": "t1",
        "classification": 1,
        "visibility": "private",
        "owner": "u-a",
    }
    assert l3_visible(data, SUBJECT) is True
    # 团队同组不可见
    team_mate = {**SUBJECT, "uid": "u-x", "teams": ["team-x"]}
    assert l3_visible(data, team_mate) is False
    # 上级也不可见（private 不按组织层级放行）
    superior = {**SUBJECT, "uid": "u-mgr", "subUids": ["u-a"]}
    assert l3_visible(data, superior) is False


def test_private_missing_owner_denied():
    data = {"tenantId": "t1", "classification": 1, "visibility": "private"}
    assert l3_visible(data, SUBJECT) is False


def test_internal_owner_scope():
    # 团队内可见
    data = {
        "tenantId": "t1",
        "classification": 1,
        "visibility": "internal",
        "owner": "team-x",
    }
    mate = {**SUBJECT, "uid": "u-mate", "teams": ["team-x"]}
    assert l3_visible(data, mate) is True
    # 上级可看下级
    sub_data = {**data, "owner": "u-b"}
    assert l3_visible(sub_data, SUBJECT) is True
    # 外部人员不可见
    outsider = {**SUBJECT, "uid": "u-z", "teams": [], "subUids": []}
    assert l3_visible(sub_data, outsider) is False


def test_secret_requires_clearance_plus_owner_scope():
    data = {
        "tenantId": "t1",
        "classification": 1,
        "visibility": "secret",
        "owner": "u-a",
    }
    assert l3_visible(data, SUBJECT) is True
    # 属主但密级不足
    low = {**SUBJECT, "clearance": 1}
    assert l3_visible(data, low) is False
    # 密级足够但非属主范围
    other = {**SUBJECT, "uid": "u-other", "teams": [], "subUids": []}
    assert l3_visible(data, other) is False


def test_unknown_visibility_denied():
    data = {
        "tenantId": "t1",
        "classification": 1,
        "visibility": "unknown-x",
        "owner": "u-a",
    }
    assert l3_visible(data, SUBJECT) is False


def test_l3_conditions_layered_visibility():
    where, params = l3_conditions(SUBJECT)
    assert "visibility = 'private' AND n.owner = $subject_uid" in where
    assert "visibility = 'internal'" in where
    assert "visibility = 'secret' AND $subject_clearance >= 2" in where
    assert "owner IN $subject_teams" in where
    assert "owner IN $subject_subUids" in where
