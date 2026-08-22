"""L3 数据级过滤单元测试（可见性只管可见：本人/下级/租户；密级只管脱敏）。"""

import pytest

from app.masking import mask_sensitive
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


def test_internal_self_and_subordinate_sees():
    data = {
        "tenantId": "t1",
        "classification": 1,
        "visibility": "internal",
        "owner": "u-a",
    }
    assert l3_visible(data, SUBJECT) is True  # 属主本人
    # 团队同组不再可见（内部=自己及下级）
    team_mate = {**SUBJECT, "uid": "u-team", "teams": ["team-x", "u-a"]}
    assert l3_visible(data, team_mate) is False
    # 下级（ownerUid ∈ subUids）可见
    sub_data = {**data, "ownerUid": "u-b"}
    assert l3_visible(sub_data, SUBJECT) is True
    # 外部人员不可见
    outsider = {**SUBJECT, "uid": "u-z", "teams": [], "subUids": []}
    assert l3_visible(sub_data, outsider) is False


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


def test_owner_username_sees():
    # import 默认打标 owner=用户名：username 匹配即可见（uid 不匹配也无妨）
    data = {
        "tenantId": "t1",
        "classification": 1,
        "visibility": "internal",
        "owner": "alice",
    }
    subj = {**SUBJECT, "uid": "u-other", "username": "alice"}
    assert l3_visible(data, subj) is True
    stranger = {**SUBJECT, "uid": "u-other", "username": "bob"}
    assert l3_visible(data, stranger) is False


def test_classification_does_not_gate_visibility():
    # 密级不参与可见性：public 数据即使密级高于 clearance 也可见（脱敏归 L4）
    data = {
        "tenantId": "t1",
        "classification": 3,
        "visibility": "public",
        "owner": "u-b",
    }
    low = {**SUBJECT, "clearance": 1}
    assert l3_visible(data, low) is True


def test_tenant_blocks():
    data = {"tenantId": "t2", "classification": 1, "visibility": "public"}
    assert l3_visible(data, SUBJECT) is False


def test_untagged_released():
    assert l3_visible({}, SUBJECT) is True


def test_l3_conditions_include_owner_visibility():
    where, params = l3_conditions(SUBJECT)
    assert "owner = $subject_uid" in where
    assert "ownerUid = $subject_uid" in where
    assert "ownerUid IN $subject_subUids" in where
    assert "owner IN $subject_subUids" in where
    assert "classification" not in where  # 密级不参与可见性
    assert params["subject_uid"] == "u-a"
    assert params["subject_subUids"] == ["u-b", "u-c"]


def test_default_subject_has_subuids():
    assert DEFAULT_SUBJECT["subUids"] == []


def test_subject_from_request_uses_default_without_header():
    from types import SimpleNamespace

    from app.pep import subject_from_request

    subject = subject_from_request(SimpleNamespace(headers={}))
    assert subject["tenantId"] == "default"
    assert subject["uid"] == "anonymous"


def test_subject_from_request_parses_context_header():
    from types import SimpleNamespace

    from app.pep import subject_from_request

    raw = '{"uid":"u1","username":"张三","roles":["analyst"]}'
    subject = subject_from_request(SimpleNamespace(headers={"X-User-Context": raw}))
    assert subject["uid"] == "u1"
    assert subject["username"] == "张三"


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
    # 团队同组不可见（内部=自己及下级）
    data = {
        "tenantId": "t1",
        "classification": 1,
        "visibility": "internal",
        "owner": "team-x",
    }
    mate = {**SUBJECT, "uid": "u-mate", "teams": ["team-x"]}
    assert l3_visible(data, mate) is False
    # 下级（ownerUid ∈ subUids）可见
    sub_data = {**data, "ownerUid": "u-b"}
    assert l3_visible(sub_data, SUBJECT) is True
    # 外部人员不可见
    outsider = {**SUBJECT, "uid": "u-z", "teams": [], "subUids": []}
    assert l3_visible(sub_data, outsider) is False


def test_secret_visibility_denied_after_removal():
    # secret 档已移除（2026-08-23）：不再按 internal 兼容，未知档位安全默认拒绝
    data = {
        "tenantId": "t1",
        "classification": 1,
        "visibility": "secret",
        "owner": "u-a",
    }
    assert l3_visible(data, SUBJECT) is False
    low = {**SUBJECT, "clearance": 1}
    assert l3_visible(data, low) is False
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
    assert "visibility = 'private'" in where
    assert "visibility = 'internal'" in where
    assert "ownerUid = $subject_uid" in where
    assert "ownerUid IN $subject_subUids" in where
    assert "owner IN $subject_subUids" in where
    assert "subject_clearance" not in params  # 密级不参与可见性


# ── L4 脱敏（密级只处理脱敏）────────────────────────


def test_mask_clearance_ge_classification_no_mask():
    data = {"classification": 1, "label": "13800001111"}
    subj = {**SUBJECT, "clearance": 2, "username": "x"}
    assert mask_sensitive("phone", dict(data), subj)["label"] == "13800001111"


def test_mask_clearance_lt_classification_masks():
    data = {"classification": 2, "label": "13800001111"}
    subj = {**SUBJECT, "clearance": 1, "username": "x"}
    assert mask_sensitive("phone", dict(data), subj)["label"] == "138****1111"


def test_mask_public_classification_no_mask():
    data = {"classification": 0, "label": "13800001111"}
    subj = {**SUBJECT, "clearance": 0, "username": "x"}
    assert mask_sensitive("phone", dict(data), subj)["label"] == "13800001111"


def test_mask_untagged_no_mask():
    data = {"label": "13800001111"}  # 无 classification → 视为公开，不脱敏
    subj = {**SUBJECT, "clearance": 0, "username": "x"}
    assert mask_sensitive("phone", dict(data), subj)["label"] == "13800001111"
