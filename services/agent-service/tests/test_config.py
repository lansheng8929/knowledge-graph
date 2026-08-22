"""config.get_env* 族（monkeypatch 环境变量）。"""

from app.config import get_env, get_env_bool, get_env_int, get_env_list


def test_get_env_default(monkeypatch):
    monkeypatch.delenv("KG_X", raising=False)
    assert get_env("KG_X", "d") == "d"
    monkeypatch.setenv("KG_X", "v")
    assert get_env("KG_X", "d") == "v"


def test_get_env_int(monkeypatch):
    monkeypatch.setenv("KG_N", "abc")
    assert get_env_int("KG_N", 8) == 8  # 非法回退
    monkeypatch.setenv("KG_N", "42")
    assert get_env_int("KG_N", 8) == 42
    monkeypatch.delenv("KG_N", raising=False)
    assert get_env_int("KG_N", 8) == 8  # 缺省回退


def test_get_env_bool(monkeypatch):
    monkeypatch.setenv("KG_B", "true")
    assert get_env_bool("KG_B", False) is True
    monkeypatch.setenv("KG_B", "0")
    assert get_env_bool("KG_B", True) is False


def test_get_env_list(monkeypatch):
    monkeypatch.setenv("KG_L", "a, b ,,c")
    assert get_env_list("KG_L") == ("a", "b", "c")
    monkeypatch.delenv("KG_L", raising=False)
    assert get_env_list("KG_L", ("x",)) == ("x",)


# ── 日志配置 ───────────────────────────────────────────

def test_setup_logging_respects_log_level(monkeypatch):
    import logging

    from service_common.logging import setup_logging

    prev = logging.getLogger().level
    monkeypatch.setenv("LOG_LEVEL", "DEBUG")
    try:
        setup_logging()
        assert logging.getLogger().level == logging.DEBUG
    finally:
        logging.getLogger().setLevel(prev)


def test_setup_logging_default_level(monkeypatch):
    import logging

    from service_common.logging import setup_logging

    prev = logging.getLogger().level
    monkeypatch.delenv("LOG_LEVEL", raising=False)
    try:
        setup_logging()
        assert logging.getLogger().level == logging.INFO
    finally:
        logging.getLogger().setLevel(prev)


def test_setup_logging_quiets_httpx(monkeypatch):
    import logging

    from service_common.logging import setup_logging

    prev = logging.getLogger("httpx").level
    prev_httpcore = logging.getLogger("httpcore").level
    prev_neo4j = logging.getLogger("neo4j").level
    try:
        setup_logging()
        assert logging.getLogger("httpx").level == logging.WARNING
        assert logging.getLogger("httpcore").level == logging.WARNING
        assert logging.getLogger("neo4j").level == logging.WARNING
    finally:
        logging.getLogger("httpx").setLevel(prev)
        logging.getLogger("httpcore").setLevel(prev_httpcore)
        logging.getLogger("neo4j").setLevel(prev_neo4j)


# ── 统一异常出口 ───────────────────────────────────────

def test_register_exception_handler_friendly(monkeypatch, caplog):
    import logging

    from fastapi import FastAPI
    from fastapi.testclient import TestClient

    from service_common.errors import register_exception_handler

    app = FastAPI()

    @app.get("/boom")
    def boom():
        raise RuntimeError("secret internal detail")

    register_exception_handler(app)
    client = TestClient(app, raise_server_exceptions=False)
    with caplog.at_level(logging.ERROR, logger="service_common.errors"):
        r = client.get("/boom")
    assert r.status_code == 500
    body = r.json()
    assert body["success"] is False
    assert "内部错误" in body["error"]
    assert "secret" not in body["error"]
    assert any("未处理异常" in rec.message for rec in caplog.records)


def test_setup_logging_human_format(monkeypatch):
    import io
    import logging

    from service_common.logging import setup_logging

    root = logging.getLogger()
    prev_level = root.level
    prev_handlers = list(root.handlers)
    stream = io.StringIO()
    real_handler = logging.StreamHandler
    monkeypatch.setattr(
        logging, "StreamHandler", lambda *a, **k: real_handler(stream, *a, **k)
    )
    try:
        setup_logging(fmt="human")
        logging.getLogger("app.llm").error("boom")
        assert "ERROR:" in stream.getvalue()
    finally:
        root.setLevel(prev_level)
        root.handlers[:] = prev_handlers
