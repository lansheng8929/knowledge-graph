"""JWT 单元测试：签发 → 校验 → 过期/篡改。"""

import time

import pytest

from app.jwt import issue, sign, verify


def test_issue_verify_roundtrip():
    token = issue("admin", {"uid": "u1", "tenantId": "t1", "clearance": 3, "roles": ["admin"], "teams": []}, "secret", 3600)
    payload = verify(token, "secret")
    assert payload["sub"] == "admin"
    assert payload["tenantId"] == "t1"
    assert payload["clearance"] == 3
    assert "exp" in payload


def test_bad_secret_rejected():
    token = sign({"sub": "a", "exp": int(time.time()) + 60}, "secret-a")
    with pytest.raises(ValueError, match="bad signature"):
        verify(token, "secret-b")


def test_expired_rejected():
    token = issue("admin", {"uid": "u1", "tenantId": "t1", "clearance": 3, "roles": [], "teams": []}, "secret", -10)
    with pytest.raises(ValueError, match="expired"):
        verify(token, "secret")


def test_malformed_rejected():
    with pytest.raises(ValueError, match="malformed"):
        verify("onlyonepart", "secret")
    with pytest.raises(ValueError, match="malformed"):
        verify("a.b.c.d", "secret")
