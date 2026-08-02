"""契约测试（T0.1）：锁定 init / search / expand / health 的响应结构。

需要可用的 Neo4j（用户手动安装到 docker）：
  NEO4J_TEST_URI=bolt://localhost:7687
  NEO4J_TEST_USER=neo4j
  NEO4J_TEST_PASSWORD=password123
未配置 NEO4J_TEST_URI 时自动 skip（不阻塞 CI）。
"""

import json
import os
import uuid

import pytest

pytest.importorskip("httpx")  # TestClient 依赖

NEO4J_TEST_URI = os.getenv("NEO4J_TEST_URI")
NEO4J_TEST_USER = os.getenv("NEO4J_TEST_USER", "neo4j")
NEO4J_TEST_PASSWORD = os.getenv("NEO4J_TEST_PASSWORD", "password123")

# 确保服务使用与测试相同的 Neo4j 实例（须在 import app 之前设置）
if NEO4J_TEST_URI:
    os.environ.setdefault("NEO4J_URI", NEO4J_TEST_URI)
    os.environ.setdefault("NEO4J_USER", NEO4J_TEST_USER)
    os.environ.setdefault("NEO4J_PASSWORD", NEO4J_TEST_PASSWORD)

pytestmark = pytest.mark.skipif(
    not NEO4J_TEST_URI,
    reason="NEO4J_TEST_URI not set (Neo4j test instance required)",
)


def _require_neo4j() -> None:
    """探测测试用 Neo4j；不可达时跳过整个契约测试模块（而非 ERROR）。"""
    from neo4j import GraphDatabase

    driver = GraphDatabase.driver(
        NEO4J_TEST_URI, auth=(NEO4J_TEST_USER, NEO4J_TEST_PASSWORD)
    )
    try:
        with driver.session() as session:
            session.run("RETURN 1")
    except Exception as e:  # noqa: BLE001
        driver.close()
        pytest.skip(f"Neo4j unreachable at {NEO4J_TEST_URI}: {e}")
    else:
        driver.close()


@pytest.fixture(scope="module")
def client():
    _require_neo4j()

    from fastapi.testclient import TestClient

    from app.main import app

    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="module")
def seed():
    """创建唯一临时测试子图，返回 id 映射；用毕清理。"""
    from neo4j import GraphDatabase

    uid = uuid.uuid4().hex[:8]
    source_id = f"kgseed-src-{uid}"
    target_id = f"kgseed-tgt-{uid}"
    link_id = f"kgseed-link-{uid}"

    driver = GraphDatabase.driver(
        NEO4J_TEST_URI, auth=(NEO4J_TEST_USER, NEO4J_TEST_PASSWORD)
    )
    try:
        with driver.session() as session:
            session.run(
                "CREATE (s:person {id: $sid, label: $slabel}) "
                "CREATE (t:person {id: $tid, label: $tlabel}) "
                "CREATE (s)-[r:OWNS {id: $lid, label: ''}]->(t)",
                sid=source_id,
                slabel=f"KG_SEED_SOURCE_{uid}",
                tid=target_id,
                tlabel=f"KG_SEED_TARGET_{uid}",
                lid=link_id,
            )
    except Exception as e:  # noqa: BLE001
        driver.close()
        pytest.skip(f"cannot seed test data: {e}")

    yield {"source": source_id, "target": target_id, "link": link_id, "uid": uid}

    try:
        with driver.session() as session:
            session.run(
                "MATCH (n) WHERE n.id IN $ids DETACH DELETE n",
                ids=[source_id, target_id],
            )
    finally:
        driver.close()


# ── 健康检查 ──────────────────────────────────────────


def test_healthz(client):
    r = client.get("/healthz")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert "version" in body


# ── init ──────────────────────────────────────────────


def test_init_empty(client):
    r = client.post("/api/v1/graph/init", json={"ids": []})
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert body["data"]["graphData"] == {"nodes": [], "links": []}


def test_init_with_ids(client, seed):
    r = client.post("/api/v1/graph/init", json={"ids": [seed["source"]]})
    assert r.status_code == 200
    body = r.json()
    nodes = body["data"]["graphData"]["nodes"]
    assert len(nodes) == 1
    node = nodes[0]
    assert node["id"] == seed["source"]
    assert node["data"]["nodeType"] == "person"


# ── search ────────────────────────────────────────────


def test_search(client, seed):
    r = client.post("/api/v1/graph/search", json={"query": seed["uid"], "limit": 10})
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert len(body["data"]["nodes"]) >= 1


# ── expand ────────────────────────────────────────────


def test_expand_ok(client, seed):
    conds = json.dumps(
        [
            {
                "relationType": "OWNS",
                "targetType": "person",
                "direction": "out",
                "filters": [
                    {"property": "label", "operator": "contains", "value": seed["uid"]}
                ],
            }
        ]
    )
    r = client.post(
        "/api/v1/graph/expand",
        json={
            "sourceNodeId": seed["source"],
            "ruleId": "test",
            "existingNodeIds": [],
            "existingLinkIds": [],
            "conditions": conds,
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert body["data"]["total"] >= 1
    assert any(n["id"] == seed["target"] for n in body["data"]["nodes"])


def test_expand_no_conditions_400(client):
    r = client.post(
        "/api/v1/graph/expand", json={"sourceNodeId": "x", "conditions": None}
    )
    assert r.status_code == 400


def test_expand_invalid_json_400(client):
    r = client.post(
        "/api/v1/graph/expand", json={"sourceNodeId": "x", "conditions": "not-json"}
    )
    assert r.status_code == 400


# ── 旧路由兼容（Strangler）───────────────────────────


def test_legacy_route_alias(client):
    r = client.post("/api/graph/init", json={"ids": []})
    assert r.status_code == 200
    assert r.json()["success"] is True
