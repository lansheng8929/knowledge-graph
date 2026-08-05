"""writer 单元测试：经 graph-ingestion 写入口（httpx mock）。"""

import json

import respx
from httpx import Response

from app.ir import ParsedEdge, ParsedEntity
from app.writer import IngestionClient

TAGS = {
    "tenantId": "t1",
    "classification": 1,
    "owner": "dept-a",
    "visibility": "internal",
}


@respx.mock
def test_ingest_nodes_ok_with_tags_and_subject():
    route = respx.post("http://ingest:8003/api/v1/ingest/nodes").mock(
        return_value=Response(200, json={"success": True})
    )
    client = IngestionClient("http://ingest:8003")
    nodes = [
        ParsedEntity(id="p1", nodeType="person", label="张三", props={"gender": "男"})
    ]
    imported, skipped, errors = client.ingest_nodes(
        nodes, TAGS, chunk=500, subject="u-1"
    )
    assert (imported, skipped, errors) == (1, 0, [])
    payload = json.loads(route.calls[0].request.content)
    assert payload["nodes"][0]["nodeType"] == "person"
    assert payload["nodes"][0]["tenantId"] == "t1"
    assert payload["nodes"][0]["props"]["gender"] == "男"
    assert route.calls[0].request.headers["X-User-Context"] == "u-1"


@respx.mock
def test_ingest_links_ok():
    route = respx.post("http://ingest:8003/api/v1/ingest/links").mock(
        return_value=Response(200, json={"success": True})
    )
    client = IngestionClient("http://ingest:8003")
    links = [
        ParsedEdge(
            id="e1",
            source="a",
            target="b",
            linkType="OWNS",
            time="2026-01-01T00:00:00Z",
        )
    ]
    imported, skipped, errors = client.ingest_links(links, TAGS)
    assert (imported, skipped) == (1, 0)
    payload = json.loads(route.calls[0].request.content)
    assert payload["links"][0]["linkType"] == "OWNS"
    assert payload["links"][0]["visibility"] == "internal"


@respx.mock
def test_ingest_chunking():
    respx.post("http://ingest:8003/api/v1/ingest/nodes").mock(
        return_value=Response(200, json={"success": True})
    )
    client = IngestionClient("http://ingest:8003")
    nodes = [
        ParsedEntity(id=f"p{i}", nodeType="person", label=f"P{i}") for i in range(12)
    ]
    imported, skipped, errors = client.ingest_nodes(nodes, TAGS, chunk=5)
    assert imported == 12
    # 12 条 / chunk 5 → 3 次请求（5+5+2）
    assert len(respx.calls) == 3


@respx.mock
def test_ingest_http_error_records_skipped():
    respx.post("http://ingest:8003/api/v1/ingest/nodes").mock(
        return_value=Response(400, text="node p1: missing required tag: owner")
    )
    client = IngestionClient("http://ingest:8003")
    nodes = [ParsedEntity(id="p1", nodeType="person", label="张三")]
    imported, skipped, errors = client.ingest_nodes(nodes, TAGS)
    assert imported == 0
    assert skipped == 1
    assert any("HTTP 400" in e for e in errors)
