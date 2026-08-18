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
