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


def test_tools_registered():
    r = client.get("/api/v1/agent/tools")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    names = [t["name"] for t in body["data"]]
    assert set(names) == {"search_nodes", "expand_graph", "analyze_node", "graph_jump_link"}


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


def test_chat_sse_llm_unavailable(monkeypatch):
    class UnhealthyLLM:
        async def chat(self, messages, tools=None):
            raise AssertionError("不应调用 chat")

        async def ping(self):
            return False, "connection refused"

    import app.chat as chat_mod

    monkeypatch.setattr(chat_mod, "get_llm", lambda: UnhealthyLLM())
    r = client.post("/api/v1/agent/chat", json={"message": "hi"})
    body = r.text
    assert "event: error" in body
    assert "LLM 服务检查失败" in body
    assert "connection refused" in body
    assert "event: done" in body
    assert "event: delta" not in body


def test_chat_sse_unknown_error_friendly(monkeypatch):
    class BrokenLLM:
        async def ping(self):
            return True, ""

        async def chat(self, messages, tools=None):
            raise RuntimeError("secret internal detail")

    import app.chat as chat_mod

    monkeypatch.setattr(chat_mod, "get_llm", lambda: BrokenLLM())
    r = client.post("/api/v1/agent/chat", json={"message": "hi"})
    body = r.text
    assert "event: error" in body
    assert "服务器开小差了" in body
    assert "secret" not in body
    assert "event: done" in body
