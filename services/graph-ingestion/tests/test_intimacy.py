"""intimacy v2 多维引擎单元测试（mock Neo4j driver，无外部依赖）。

覆盖：类型权重 / 业务指标 / 时间衰减 / 频次（默认关）维度、
组合策略（product | weighted_sum）、配置加载、重算（recompute）。
"""

import copy
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone

from app.intimacy import (
    DEFAULT_INTIMACY_CONFIG,
    compute_intimacy,
    load_config,
    recompute_intimacy,
)
from app.models import IntimacyEdge, RecomputeIntimacyRequest


class _FakeSession:
    """模拟 Neo4j session.run：计数查询 / 重算加载 / SET 更新。"""

    def __init__(self, records=None, counts=None, setters=None):
        self._records = records or []
        self._counts = counts or {}
        self._setters = setters

    def run(self, query, **params):
        if "SET r.intimacy" in query:
            if self._setters is not None:
                self._setters.append((params["id"], params["v"]))
            return []
        if "OPTIONAL MATCH" in query:  # existing 计数（frequency 维度）
            return [
                {"p": list(p), "n": self._counts.get(tuple(p), 0)}
                for p in params.get("pairs", [])
            ]
        if "MATCH (a)-[r]->(b)" in query:  # 重算加载
            return list(self._records)
        return []


class _FakeDriver:
    def __init__(self, records=None, counts=None, setters=None):
        self._records = records or []
        self._counts = counts or {}
        self._setters = setters if setters is not None else []

    @contextmanager
    def session(self):
        yield _FakeSession(self._records, self._counts, self._setters)


def _cfg(**over):
    cfg = copy.deepcopy(DEFAULT_INTIMACY_CONFIG)
    cfg.update(over)
    return cfg


def _cfg_dim(
    link_weights=None,
    business=None,
    time_decay=None,
    freq=False,
    combine="product",
):
    cfg = copy.deepcopy(DEFAULT_INTIMACY_CONFIG)
    cfg["combine"] = combine
    d = cfg["dimensions"]
    d["linkTypeWeight"]["weights"] = link_weights or {}
    d["businessMetric"] = business or {"enabled": False, "fields": []}
    d["timeDecay"] = time_decay or {
        "enabled": False, "field": "time", "halfLifeDays": 365, "default": 0.5,
    }
    d["frequency"]["enabled"] = freq
    return cfg


def _edge(eid, s, t, link_type="CALL", weight=1.0, props=None, time=""):
    return IntimacyEdge(
        id=eid, source=s, target=t, linkType=link_type,
        weight=weight, props=props or {}, time=time,
    )


def _days_ago(days):
    return (datetime.now(timezone.utc) - timedelta(days=days)).strftime(
        "%Y-%m-%dT%H:%M:%SZ"
    )


# ── 维度：类型权重 ────────────────────────────────────

def test_link_type_weight_dimension():
    cfg = _cfg_dim(link_weights={"CALL": 0.6, "TRANSFER": 0.9})
    edges = [
        _edge("e1", "a", "b", link_type="CALL"),
        _edge("e2", "a", "c", link_type="TRANSFER"),
        _edge("e3", "a", "d", link_type="OWNS"),  # 未知类型 → defaultWeight 0.5
    ]
    intimacies, _ = compute_intimacy(_FakeDriver(), edges, cfg)
    assert intimacies["e1"] == 0.6
    assert intimacies["e2"] == 0.9
    assert intimacies["e3"] == 0.5


def test_weight_override_when_type_unknown():
    """调用方 weight 覆盖：linkType 不在 weights 时，用 edge.weight。"""
    cfg = _cfg_dim(link_weights={})
    e = _edge("e1", "a", "b", link_type="UNKNOWN", weight=0.7)
    intimacies, _ = compute_intimacy(_FakeDriver(), [e], cfg)
    assert intimacies["e1"] == 0.7


# ── 维度：业务指标归一化 ─────────────────────────────

def test_business_metric_dimension():
    cfg = _cfg_dim(
        link_weights={},
        business={"enabled": True, "fields": [{"field": "amount", "min": 0, "max": 100000}]},
    )
    e = _edge("e1", "a", "b", props={"amount": 80000})
    intimacies, _ = compute_intimacy(_FakeDriver(), [e], cfg)
    # linkType default 0.5 × business 0.8 = 0.4
    assert intimacies["e1"] == 0.4


def test_business_metric_missing_field_uses_default():
    cfg = _cfg_dim(
        link_weights={},
        business={
            "enabled": True,
            "fields": [{"field": "amount", "min": 0, "max": 100000, "default": 0.5}],
        },
    )
    e = _edge("e1", "a", "b", props={})  # 无 amount 字段
    intimacies, _ = compute_intimacy(_FakeDriver(), [e], cfg)
    assert intimacies["e1"] == round(0.5 * 0.5, 4)  # 0.25


# ── 维度：时间衰减 ───────────────────────────────────

def test_time_decay_dimension():
    cfg = _cfg_dim(
        link_weights={},
        time_decay={"enabled": True, "field": "time", "halfLifeDays": 365, "default": 0.5},
    )
    e_old = _edge("e1", "a", "b", time=_days_ago(365))  # 半衰期 → 0.5
    e_new = _edge("e2", "a", "c", time=_days_ago(0))    # 现在 → 1.0
    intimacies, _ = compute_intimacy(_FakeDriver(), [e_old, e_new], cfg)
    assert intimacies["e1"] == round(0.5 * 0.5, 4)  # 0.25
    assert intimacies["e2"] == round(0.5 * 1.0, 4)  # 0.5


def test_time_decay_invalid_time_uses_default():
    cfg = _cfg_dim(
        link_weights={},
        time_decay={"enabled": True, "field": "time", "halfLifeDays": 365, "default": 0.5},
    )
    e = _edge("e1", "a", "b", time="not-a-date")
    intimacies, _ = compute_intimacy(_FakeDriver(), [e], cfg)
    assert intimacies["e1"] == round(0.5 * 0.5, 4)


# ── 组合策略 ─────────────────────────────────────────

def test_weighted_sum_combine():
    cfg = _cfg_dim(link_weights={"CALL": 0.6}, combine="weighted_sum")
    e = _edge("e1", "a", "b")
    intimacies, _ = compute_intimacy(_FakeDriver(), [e], cfg)
    # scores = [0.6, 1.0(biz 关), 1.0(time 关)] → 平均 2.6/3
    assert intimacies["e1"] == round(2.6 / 3, 4)


# ── 维度：频次（默认关）──────────────────────────────

def test_frequency_disabled_does_not_query_library():
    cfg = _cfg_dim(link_weights={})  # freq 默认关
    driver = _FakeDriver(counts={("a", "b"): 100})  # 即使有计数也不应查询
    intimacies, _ = compute_intimacy(driver, [_edge("e1", "a", "b")], cfg)
    # 只受类型权重影响（不含边数）
    assert intimacies["e1"] == 0.5


def test_frequency_enabled_uses_library_count():
    cfg = _cfg_dim(link_weights={}, freq=True)
    driver = _FakeDriver(counts={("a", "b"): 2})
    intimacies, _ = compute_intimacy(driver, [_edge("e1", "a", "b")], cfg)
    # scores = [0.5, 1.0, 1.0, freq(2+1=3)=0.75] → product = 0.375
    assert intimacies["e1"] == round(0.5 * 0.75, 4)


# ── 配置加载 ─────────────────────────────────────────

def test_load_config_default_and_invalid():
    assert load_config("") == DEFAULT_INTIMACY_CONFIG
    assert load_config(None) == DEFAULT_INTIMACY_CONFIG
    assert load_config("{bad json") == DEFAULT_INTIMACY_CONFIG


def test_load_config_valid():
    cfg = load_config(
        '{"version": 2, "combine": "product", "dimensions": '
        '{"linkTypeWeight": {"enabled": true, "weights": {"X": 0.8}, "defaultWeight": 0.5}}}'
    )
    assert cfg["dimensions"]["linkTypeWeight"]["weights"]["X"] == 0.8


# ── 重算（可更新）────────────────────────────────────

def test_recompute_updates_edges():
    cfg = _cfg_dim(link_weights={"CALL": 0.6})
    records = [
        {
            "id": "e1", "source": "a", "target": "b", "linkType": "CALL",
            "r": {"id": "e1", "label": "l", "time": "2026-01-01T00:00:00Z", "amount": 50000},
        }
    ]
    setters = []
    driver = _FakeDriver(records=records, setters=setters)
    updated = recompute_intimacy(driver, cfg, RecomputeIntimacyRequest(scope="all"))
    assert updated == 1
    assert ("e1", 0.6) in setters


def test_recompute_empty_scope():
    setters = []
    driver = _FakeDriver(records=[], setters=setters)
    updated = recompute_intimacy(driver, _cfg(), RecomputeIntimacyRequest(scope="all"))
    assert updated == 0
    assert setters == []
