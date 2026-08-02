"""规则 API 集成测试（InMemory 存储，无需 PostgreSQL）。"""

import json

import pytest

pytest.importorskip("httpx")

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402

RULE_BODY = {
    "name": "按人名拓出关联人",
    "owner": "tester",
    "allowedTargetTypes": ["person", "phone"],
    "allowedRelationTypes": ["OWNS", "CALLED"],
    "allowedProperties": ["label", "age"],
    "allowedOperators": ["eq", "contains"],
}


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def test_healthz(client):
    r = client.get("/healthz")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_create_and_get(client):
    r = client.post("/api/v1/rules", json=RULE_BODY)
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    rule = body["data"]
    assert rule["status"] == "draft"
    assert rule["version"] == 1
    rid = rule["id"]

    r2 = client.get(f"/api/v1/rules/{rid}")
    assert r2.status_code == 200
    assert r2.json()["data"]["name"] == RULE_BODY["name"]


def test_list(client):
    r = client.get("/api/v1/rules")
    assert r.status_code == 200
    assert isinstance(r.json()["data"]["rules"], list)


def test_update_bumps_version(client):
    r = client.post("/api/v1/rules", json=RULE_BODY)
    rid = r.json()["data"]["id"]
    body = {**RULE_BODY, "name": "改名后的规则"}
    r2 = client.put(f"/api/v1/rules/{rid}", json=body)
    assert r2.json()["data"]["version"] == 2
    assert r2.json()["data"]["name"] == "改名后的规则"


def test_publish(client):
    r = client.post("/api/v1/rules", json=RULE_BODY)
    rid = r.json()["data"]["id"]
    r2 = client.post(f"/api/v1/rules/{rid}/publish")
    assert r2.json()["data"]["status"] == "published"


def test_validate_ok(client):
    r = client.post("/api/v1/rules", json=RULE_BODY)
    rid = r.json()["data"]["id"]
    conds = json.dumps(
        [
            {
                "relationType": "OWNS",
                "targetType": "person",
                "direction": "out",
                "filters": [{"property": "label", "operator": "contains", "value": "张"}],
            }
        ]
    )
    r2 = client.post("/api/v1/rules/validate", json={"ruleId": rid, "conditions": conds})
    assert r2.status_code == 200
    assert r2.json()["data"]["valid"] is True


def test_validate_rejects_outside_whitelist(client):
    r = client.post("/api/v1/rules", json=RULE_BODY)
    rid = r.json()["data"]["id"]
    conds = json.dumps(
        [
            {
                "relationType": "OWNS",
                "targetType": "company",  # 不在白名单
                "direction": "out",
            }
        ]
    )
    r2 = client.post("/api/v1/rules/validate", json={"ruleId": rid, "conditions": conds})
    assert r2.json()["data"]["valid"] is False
    assert any("targetType" in e for e in r2.json()["data"]["errors"])


def test_validate_unknown_rule(client):
    r = client.post(
        "/api/v1/rules/validate", json={"ruleId": "nope", "conditions": "[]"}
    )
    assert r.json()["data"]["valid"] is False


def test_delete(client):
    r = client.post("/api/v1/rules", json=RULE_BODY)
    rid = r.json()["data"]["id"]
    r2 = client.delete(f"/api/v1/rules/{rid}")
    assert r2.status_code == 200
    r3 = client.get(f"/api/v1/rules/{rid}")
    assert r3.status_code == 404
