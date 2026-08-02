"""登录 / 用户管理 / userinfo API 测试（FastAPI TestClient）。

用户不再硬编码：AUTH_BOOTSTRAP_ADMIN_PASSWORD 只 bootstrap 初始 admin；
其它用户经 /api/v1/auth/users（admin）创建；演示账户由 app.seed_users 脚本插入。
"""

import os

os.environ["AUTH_BOOTSTRAP_ADMIN_PASSWORD"] = "admin123"

from fastapi.testclient import TestClient  # noqa: E402

from app.main import create_app  # noqa: E402


def _client() -> TestClient:
    return TestClient(create_app())


def _admin_token(client: TestClient) -> str:
    r = client.post(
        "/api/v1/auth/login", json={"username": "admin", "password": "admin123"}
    )
    return r.json()["data"]["token"]


def _create_user(client: TestClient, username: str, password: str = "pw", roles=None):
    tok = _admin_token(client)
    return client.post(
        "/api/v1/auth/users",
        headers={"Authorization": f"Bearer {tok}"},
        json={"username": username, "password": password, "roles": roles or []},
    )


def test_login_ok():
    client = _client()
    r = client.post(
        "/api/v1/auth/login", json={"username": "admin", "password": "admin123"}
    )
    assert r.status_code == 200
    assert r.json()["data"]["token"].count(".") == 2
    assert r.json()["data"]["user"]["clearance"] == 3


def test_login_wrong_password():
    r = _client().post(
        "/api/v1/auth/login", json={"username": "admin", "password": "nope"}
    )
    assert r.status_code == 401


def test_login_unknown_user():
    r = _client().post("/api/v1/auth/login", json={"username": "ghost", "password": "x"})
    assert r.status_code == 401


def test_userinfo():
    client = _client()
    tok = _admin_token(client)
    r = client.get("/api/v1/auth/userinfo", headers={"Authorization": f"Bearer {tok}"})
    assert r.status_code == 200
    assert "admin" in r.json()["data"]["user"]["roles"]


def test_list_users_requires_admin():
    client = _client()
    assert _create_user(client, "bob", roles=["viewer"]).status_code == 200
    bt = client.post(
        "/api/v1/auth/login", json={"username": "bob", "password": "pw"}
    ).json()["data"]["token"]
    r = client.get("/api/v1/auth/users", headers={"Authorization": f"Bearer {bt}"})
    assert r.status_code == 403


def test_create_user_and_login():
    client = _client()
    assert _create_user(client, "carol", password="carolpw", roles=["analyst"]).status_code == 200
    r2 = client.post(
        "/api/v1/auth/login", json={"username": "carol", "password": "carolpw"}
    )
    assert r2.status_code == 200
    assert r2.json()["data"]["user"]["roles"] == ["analyst"]


def test_authz_ok():
    client = _client()
    tok = _admin_token(client)
    r = client.get("/_authz", headers={"Authorization": f"Bearer {tok}"})
    assert r.status_code == 200
    assert "x-subject-context" in r.headers


def test_authz_missing_token():
    r = _client().get("/_authz")
    assert r.status_code == 401
