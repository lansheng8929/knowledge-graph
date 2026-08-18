"""permissions 单元测试：按登录主体计算可配置选项 + 打标越权校验。"""

import json
import time

from fastapi.testclient import TestClient

from app.jwt import sign
from app.main import app
from app.permissions import (
    check_tags_permitted,
    classification_max,
    import_options,
    subject_from_header,
    visibility_allowed,
)

client = TestClient(app)

SECRET = "dev-secret-change-me"

ADMIN = {
    "username": "admin",
    "uid": "u-admin",
    "tenantId": "default",
    "clearance": 3,
    "roles": ["admin", "analyst", "privileged"],
    "teams": ["ops"],
    "orgPath": "default/ops",
}
ANALYST = {
    "username": "analyst",
    "uid": "u-analyst",
    "tenantId": "default",
    "clearance": 1,
    "roles": ["analyst"],
    "teams": ["analysis"],
    "orgPath": "default/ops/analysts",
}
VIEWER = {
    "username": "viewer",
    "uid": "u-viewer",
    "tenantId": "default",
    "clearance": 0,
    "roles": ["viewer"],
    "teams": [],
}
OTHER = {
    "username": "other-tenant",
    "uid": "u-other",
    "tenantId": "other-tenant",
    "clearance": 2,
    "roles": ["analyst"],
    "teams": [],
}


def test_subject_from_header_parses_json():
    s = subject_from_header(json.dumps(ANALYST))
    assert s["username"] == "analyst"
    assert s["clearance"] == 1
    assert s["roles"] == ["analyst"]


def test_subject_from_header_missing_is_default():
    s = subject_from_header("")
    assert s["uid"] == "anonymous"


def test_visibility_allowed_by_clearance():
    # 2026-08-06 起可见性统一为 public/internal/private（无 secret 档）
    assert visibility_allowed(VIEWER) == ["public", "internal", "private"]
    assert visibility_allowed(ANALYST) == ["public", "internal", "private"]
    assert visibility_allowed(OTHER) == ["public", "internal", "private"]
    assert visibility_allowed(ADMIN) == ["public", "internal", "private"]


def test_classification_max_capped():
    assert classification_max(VIEWER) == 0
    assert classification_max(ANALYST) == 1
    assert classification_max(OTHER) == 2
    assert classification_max(ADMIN) == 3
    # 高于全局上限也收敛到 3
    assert classification_max({**ADMIN, "clearance": 9}) == 3


def test_import_options_defaults():
    opts = import_options(ANALYST)
    assert opts["defaults"]["tenantId"] == "default"
    assert opts["defaults"]["owner"] == "analyst"
    assert opts["defaults"]["classification"] == 0
    assert opts["defaults"]["visibility"] == "internal"
    assert opts["constraints"]["classificationMax"] == 1
    assert "secret" not in opts["constraints"]["visibilityAllowed"]
    assert opts["constraints"]["canSetTenant"] is False
    assert opts["constraints"]["canSetOwner"] is False
    # admin 可改租户/属主
    assert import_options(ADMIN)["constraints"]["canSetTenant"] is True


# ── 打标越权校验 ─────────────────────────────────────


def test_unauthenticated_not_restricted():
    tags = {"tenantId": "x", "classification": 3, "owner": "y", "visibility": "secret"}
    assert check_tags_permitted(dict(tags), ADMIN, authenticated=False) == []


def test_non_admin_owner_system_autofilled_to_self():
    tags = {
        "tenantId": "default",
        "classification": 1,
        "owner": "system",
        "visibility": "internal",
    }
    errs = check_tags_permitted(tags, ANALYST, authenticated=True)
    assert errs == []
    assert tags["owner"] == "analyst"


def test_non_admin_owner_other_denied():
    tags = {
        "tenantId": "default",
        "classification": 1,
        "owner": "someone-else",
        "visibility": "internal",
    }
    errs = check_tags_permitted(tags, ANALYST, authenticated=True)
    assert any("owner" in e for e in errs)


def test_non_admin_tenant_autofilled_for_cross_tenant():
    tags = {
        "tenantId": "default",
        "classification": 2,
        "owner": "other-tenant",
        "visibility": "internal",
    }
    errs = check_tags_permitted(tags, OTHER, authenticated=True)
    assert errs == []
    assert tags["tenantId"] == "other-tenant"


def test_classification_over_clearance_denied():
    tags = {
        "tenantId": "default",
        "classification": 3,
        "owner": "analyst",
        "visibility": "internal",
    }
    errs = check_tags_permitted(tags, ANALYST, authenticated=True)
    assert any("classification" in e for e in errs)


def test_secret_visibility_without_clearance_denied():
    tags = {
        "tenantId": "default",
        "classification": 1,
        "owner": "analyst",
        "visibility": "secret",
    }
    errs = check_tags_permitted(tags, ANALYST, authenticated=True)
    assert any("visibility" in e for e in errs)


def test_admin_allowed_anything():
    tags = {
        "tenantId": "other-tenant",
        "classification": 3,
        "owner": "dept-a",
        "visibility": "private",
    }
    errs = check_tags_permitted(dict(tags), ADMIN, authenticated=True)
    assert errs == []


# ── 端点 ─────────────────────────────────────────────


def test_options_endpoint_with_user():
    r = client.get(
        "/api/v1/import/options",
        headers={"X-User-Context": json.dumps(ANALYST)},
    )
    assert r.status_code == 200
    data = r.json()["data"]
    assert data["user"]["username"] == "analyst"
    assert data["defaults"]["owner"] == "analyst"
    assert data["constraints"]["classificationMax"] == 1
    assert "secret" not in data["constraints"]["visibilityAllowed"]


def test_options_endpoint_without_user():
    r = client.get("/api/v1/import/options")
    assert r.status_code == 200
    data = r.json()["data"]
    # 无鉴权直连：不限制
    assert data["constraints"]["classificationMax"] == 3
    assert data["constraints"]["visibilityAllowed"] == [
        "public",
        "internal",
        "private",
    ]


# ── dev 直连兜底：Authorization Bearer JWT ────────────


def _token(clearance: int = 1, roles=None, tenant_id="default") -> str:
    now = int(time.time())
    payload = {
        "iss": "kg-auth",
        "aud": "kg-platform",
        "sub": "analyst",
        "jti": "t1",
        "uid": "u-analyst",
        "tenantId": tenant_id,
        "clearance": clearance,
        "roles": roles or ["analyst"],
        "teams": ["analysis"],
        "orgPath": "default/ops/analysts",
        "managerUid": "u-admin",
        "subUids": [],
        "iat": now,
        "exp": now + 3600,
    }
    return sign(payload, SECRET)


def test_options_endpoint_via_authorization_jwt():
    r = client.get(
        "/api/v1/import/options",
        headers={"Authorization": f"Bearer {_token()}"},
    )
    assert r.status_code == 200
    data = r.json()["data"]
    assert data["user"]["username"] == "analyst"
    assert data["constraints"]["classificationMax"] == 1
    assert "secret" not in data["constraints"]["visibilityAllowed"]
    assert data["constraints"]["canSetOwner"] is False


def test_options_endpoint_admin_jwt_full():
    r = client.get(
        "/api/v1/import/options",
        headers={
            "Authorization": f"Bearer {_token(3, ['admin', 'analyst', 'privileged'])}"
        },
    )
    data = r.json()["data"]
    assert data["constraints"]["classificationMax"] == 3
    assert data["constraints"]["canSetOwner"] is True
    assert "secret" not in data["constraints"]["visibilityAllowed"]


def test_options_endpoint_bad_jwt_falls_back_unrestricted():
    r = client.get(
        "/api/v1/import/options",
        headers={"Authorization": "Bearer not.a.token"},
    )
    assert r.status_code == 200
    data = r.json()["data"]
    assert data["constraints"]["classificationMax"] == 3
    assert data["constraints"]["visibilityAllowed"] == [
        "public",
        "internal",
        "private",
    ]
