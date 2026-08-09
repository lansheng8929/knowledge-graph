"""亲密度计算引擎 v2（多维 + 配置驱动 + 可更新）。

设计（docs/intimacy-pipeline-plan.md §9）：
- 亲密度 = **单条边的质量**，不含边数（"边越多越近"交给前端物理引擎多边叠加）。
- 维度：linkTypeWeight / businessMetric / timeDecay / frequency（默认关）。
  每个维度独立算 0~1 分；维度关闭返回 1.0（product 下的中性值）。
- 组合：product（默认，任一维低则整体低）| weighted_sum。
- 可更新：recompute_intimacy 按当前配置重算并 SET 更新库中边。

配置经 INTIMACY_CONFIG（JSON）注入（见 config.py），变更后触发重算即可刷新。
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

from neo4j import Driver

from . import models as m

# 关系公共字段（recompute 重建业务 props 时剔除）
_PUBLIC_FIELDS = {
    "id", "label", "time", "rank", "tenantId", "classification",
    "owner", "visibility", "ownerUid", "intimacy", "clusterId",
}

DEFAULT_INTIMACY_CONFIG: Dict[str, Any] = {
    "version": 2,
    "combine": "product",
    "dimensions": {
        "linkTypeWeight": {"enabled": True, "weights": {}, "defaultWeight": 0.5},
        "businessMetric": {"enabled": False, "fields": []},
        "timeDecay": {
            "enabled": False, "field": "time", "halfLifeDays": 365,
            "refTime": "now", "default": 0.5,
        },
        "frequency": {"enabled": False},
    },
}


def load_config(raw: Optional[str]) -> Dict[str, Any]:
    """解析 INTIMACY_CONFIG JSON；空/非法 → 默认配置。"""
    if not raw or not raw.strip():
        return DEFAULT_INTIMACY_CONFIG
    try:
        cfg = json.loads(raw)
    except json.JSONDecodeError:
        return DEFAULT_INTIMACY_CONFIG
    return cfg


def _dim(cfg: Dict[str, Any], name: str) -> Dict[str, Any]:
    return cfg.get("dimensions", {}).get(name, {}) or {}


def _pair_key(s: str, t: str) -> Tuple[str, str]:
    """无向对 key：排序保证 a-b 与 b-a 合并。"""
    return (s, t) if s <= t else (t, s)


# ── 各维度得分（0~1；维度关闭 → 1.0 中性）──────────────

def _score_link_type(edge: m.IntimacyEdge, cfg: Dict[str, Any]) -> float:
    """类型权重：weights[linkType] > 调用方 weight > defaultWeight。"""
    d = _dim(cfg, "linkTypeWeight")
    if not d.get("enabled", False):
        return 1.0
    weights = d.get("weights", {}) or {}
    if edge.linkType in weights:
        return max(0.0, min(1.0, float(weights[edge.linkType])))
    if edge.weight is not None and float(edge.weight) != 1.0:
        return max(0.0, min(1.0, float(edge.weight)))
    return float(d.get("defaultWeight", 0.5))


def _score_business(edge: m.IntimacyEdge, cfg: Dict[str, Any]) -> float:
    """业务指标归一化：score = clamp((v-min)/(max-min), 0, 1)；多字段取均值。"""
    d = _dim(cfg, "businessMetric")
    fields = d.get("fields", []) or []
    if not d.get("enabled", False) or not fields:
        return 1.0
    props = edge.props or {}
    scores: List[float] = []
    for f in fields:
        raw = props.get(f.get("field"))
        if raw is None:
            scores.append(float(f.get("default", 0.5)))
            continue
        try:
            v = float(raw)
        except (TypeError, ValueError):
            scores.append(float(f.get("default", 0.5)))
            continue
        lo = float(f.get("min", 0))
        hi = float(f.get("max", 1))
        if hi <= lo:
            hi = lo + 1.0
        scores.append(max(0.0, min(1.0, (v - lo) / (hi - lo))))
    return sum(scores) / len(scores) if scores else 1.0


def _parse_epoch(s: str) -> Optional[float]:
    """ISO 时间 → epoch 秒；解析失败返回 None。"""
    if not s:
        return None
    try:
        s2 = str(s).strip().replace("Z", "+00:00")
        dt = datetime.fromisoformat(s2)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.timestamp()
    except ValueError:
        return None


def _score_time(edge: m.IntimacyEdge, cfg: Dict[str, Any], now_epoch: float) -> float:
    """时间衰减：score = 0.5^(age_days/halfLifeDays)，越新越接近 1。"""
    d = _dim(cfg, "timeDecay")
    if not d.get("enabled", False):
        return 1.0
    field = d.get("field", "time")
    raw = (edge.props or {}).get(field, edge.time) if edge.props else edge.time
    t = _parse_epoch(raw)
    if t is None:
        return float(d.get("default", 0.5))
    half_life_days = float(d.get("halfLifeDays", 365))
    if half_life_days <= 0:
        half_life_days = 365.0
    age_days = max(0.0, (now_epoch - t) / 86400.0)
    return 0.5 ** (age_days / half_life_days)


def _score_frequency(count: int) -> float:
    """频次热度（默认关闭维度）：同对边越多越接近 1。"""
    return 1.0 - 1.0 / (1.0 + count)


def _combine(scores: List[float], cfg: Dict[str, Any]) -> float:
    if not scores:
        return 0.5
    if cfg.get("combine") == "weighted_sum":
        return sum(scores) / len(scores)
    out = 1.0
    for s in scores:
        out *= s
    return max(0.0, min(1.0, out))


def _batch_counts(edges: List[m.IntimacyEdge]) -> Dict[Tuple[str, str], int]:
    counts: Dict[Tuple[str, str], int] = {}
    for e in edges:
        k = _pair_key(e.source, e.target)
        counts[k] = counts.get(k, 0) + 1
    return counts


def _existing_counts(
    driver: Driver, pairs: List[Tuple[str, str]]
) -> Dict[Tuple[str, str], int]:
    """一次 UNWIND 查询：统计每对 (s,t) 全库已存在关系数（无向、跨 linkType）。"""
    if not pairs:
        return {}
    existing: Dict[Tuple[str, str], int] = {}
    query = """
    UNWIND $pairs AS p
    OPTIONAL MATCH (s {id: p[0]})-[r]-(t {id: p[1]})
    WITH p, count(r) AS n
    RETURN p, n
    """
    with driver.session() as session:
        for rec in session.run(query, pairs=pairs):
            p = rec["p"]
            k = _pair_key(p[0], p[1])
            existing[k] = existing.get(k, 0) + int(rec["n"])
    return existing


def _score_edges(
    edges: List[m.IntimacyEdge],
    cfg: Dict[str, Any],
    freq_existing: Optional[Dict[Tuple[str, str], int]] = None,
    freq_batch: Optional[Dict[Tuple[str, str], int]] = None,
) -> Tuple[Dict[str, float], Dict[str, Dict]]:
    """纯计算：对每条边按配置算单条质量（不含边数，除非 frequency 维度开启）。"""
    now_epoch = datetime.now(timezone.utc).timestamp()
    freq_enabled = bool(_dim(cfg, "frequency").get("enabled"))
    intimacies: Dict[str, float] = {}
    stats: Dict[str, Dict] = {}
    for e in edges:
        s_type = _score_link_type(e, cfg)
        s_biz = _score_business(e, cfg)
        s_time = _score_time(e, cfg, now_epoch)
        scores: List[float] = [s_type, s_biz, s_time]
        if freq_enabled:
            k = _pair_key(e.source, e.target)
            total = (freq_existing or {}).get(k, 0) + (freq_batch or {}).get(k, 0)
            scores.append(_score_frequency(total))
        intimacy = _combine(scores, cfg)
        intimacies[e.id] = round(intimacy, 4)
        stats[e.id] = {
            "scores": {
                "linkType": round(s_type, 4),
                "business": round(s_biz, 4),
                "time": round(s_time, 4),
            }
        }
    return intimacies, stats


def compute_intimacy(
    driver: Driver,
    edges: List[m.IntimacyEdge],
    cfg: Dict[str, Any],
) -> Tuple[Dict[str, float], Dict[str, Dict]]:
    """按配置计算每条边亲密度（只读，不写库）。

    frequency 维度默认关闭；仅当其启用时才查询全库统计。
    """
    freq_existing = freq_batch = None
    if _dim(cfg, "frequency").get("enabled"):
        pairs = list({_pair_key(e.source, e.target) for e in edges})
        freq_existing = _existing_counts(driver, pairs)
        freq_batch = _batch_counts(edges)
    return _score_edges(edges, cfg, freq_existing, freq_batch)


def _relation_view(rec) -> m.IntimacyEdge:
    """把库中关系记录转成可计算视图（业务 props = 剔除公共字段后的剩余属性）。"""
    r = dict(rec["r"])
    props = {k: v for k, v in r.items() if k not in _PUBLIC_FIELDS}
    return m.IntimacyEdge(
        id=rec["id"],
        source=rec["source"],
        target=rec["target"],
        linkType=rec["linkType"],
        props=props,
        time=str(r.get("time", "")),
    )


def _scope_query(req: m.RecomputeIntimacyRequest) -> Tuple[str, Dict]:
    """按 scope 构造查询（all | linkTypes | edgeIds | pairs）。"""
    if req.scope == "linkTypes":
        return (
            "MATCH (a)-[r]->(b) WHERE type(r) IN $types "
            "RETURN r.id AS id, a.id AS source, b.id AS target, type(r) AS linkType, r",
            {"types": list(req.linkTypes)},
        )
    if req.scope == "edgeIds":
        return (
            "MATCH (a)-[r]->(b) WHERE r.id IN $ids "
            "RETURN r.id AS id, a.id AS source, b.id AS target, type(r) AS linkType, r",
            {"ids": list(req.edgeIds)},
        )
    if req.scope == "pairs":
        return (
            "UNWIND $pairs AS p "
            "MATCH (a {id: p[0]})-[r]->(b {id: p[1]}) "
            "RETURN r.id AS id, a.id AS source, b.id AS target, type(r) AS linkType, r",
            {"pairs": [list(p) for p in req.pairs]},
        )
    return (
        "MATCH (a)-[r]->(b) "
        "RETURN r.id AS id, a.id AS source, b.id AS target, type(r) AS linkType, r",
        {},
    )


def recompute_intimacy(
    driver: Driver, cfg: Dict[str, Any], req: m.RecomputeIntimacyRequest
) -> int:
    """按当前配置重算并更新库中边（可更新）。返回更新条数。"""
    query, params = _scope_query(req)
    edges: List[m.IntimacyEdge] = []
    with driver.session() as session:
        for rec in session.run(query, **params):
            edges.append(_relation_view(rec))
    if not edges:
        return 0
    intimacies, _ = _score_edges(edges, cfg)
    updated = 0
    with driver.session() as session:
        for eid, val in intimacies.items():
            session.run(
                "MATCH ()-[r]->() WHERE r.id=$id SET r.intimacy=$v",
                id=eid, v=val,
            )
            updated += 1
    return updated
