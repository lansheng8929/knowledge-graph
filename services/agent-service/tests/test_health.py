"""P0/P1 冒烟：健康检查 + 工具注册表 + chat SSE 端点。"""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_healthz():
    r = client.get("/healthz")
    assert r.status_code == 200
    body = r.json()
    assert body["service"] == "agent-service"
    assert body["llm_provider"] == "mock"


def test_tools_empty_registry():
    r = client.get("/api/v1/agent/tools")
    assert r.status_code == 200
    assert r.json() == {"success": True, "data": []}


def test_chat_sse_stream():
    r = client.post("/api/v1/agent/chat", json={"message": "hi"})
    assert r.status_code == 200
    assert r.headers["content-type"].startswith("text/event-stream")
    body = r.text
    assert "event: delta" in body
    assert "event: done" in body
    assert "[mock] hi" in body


def test_chat_bad_body_emits_error_event():
    r = client.post("/api/v1/agent/chat", json={"foo": 1})
    assert r.status_code == 200  # 流式端点不因请求非法而 4xx，转 error 事件
    body = r.text
    assert "event: error" in body
    assert "event: done" in body
