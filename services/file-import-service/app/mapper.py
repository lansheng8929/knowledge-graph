"""映射器：统一表格 → ParsedGraph。

保留列规则：
  entities: id | nodeType | label | icon        （其余列 → props）
  edges:    id | source | target | linkType | label | time | rank（其余列 → props）

边 id 哈希（与 docs/import-module-plan.md §3.1 一致）：
  edgeId = sha1(linkType | sourceId | targetId | businessKeys… | rank)
  - businessKey（可多个，配置）按序拼入；
  - rank：update 模式恒 0（幂等去重）；insert 模式 = 批内相同边出现序号（0,1,2,…）；
  - time（更新时间）不进哈希。
"""

from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from typing import Dict, List

from .ir import ParsedEdge, ParsedEntity, ParsedGraph
from .models import ImportConfig
from .parsers import Table, norm_value

ENTITY_RESERVED = ("id", "nodeType", "label", "icon")
EDGE_RESERVED = ("id", "source", "target", "linkType", "label", "time", "rank")


def _sha1(*parts: str) -> str:
    h = hashlib.sha1()
    for p in parts:
        h.update((p or "").encode("utf-8"))
        h.update(b"\x1f")
    return h.hexdigest()


def _str(value: object) -> str:
    return str(norm_value(value) or "").strip()


def map_entities(
    rows: List[Dict], config: ImportConfig, warnings: List[str]
) -> List[ParsedEntity]:
    out: List[ParsedEntity] = []
    for i, row in enumerate(rows, start=2):  # 表头占第 1 行
        node_type = _str(row.get("nodeType"))
        if not node_type:
            node_type = config.nodeTypeDefault
            if not node_type:
                warnings.append(f"entities row {i}: missing nodeType, skipped")
                continue
        label = _str(row.get("label"))
        icon = _str(row.get("icon"))
        props = {
            k: norm_value(v)
            for k, v in row.items()
            if k not in ENTITY_RESERVED and str(v).strip() != ""
        }
        eid = _str(row.get("id"))
        if not eid:
            eid = "e-" + _sha1(
                node_type,
                label,
                json.dumps(props, sort_keys=True, ensure_ascii=False),
            )
        out.append(
            ParsedEntity(
                id=eid, nodeType=node_type, label=label, icon=icon, props=props
            )
        )
    return out


def map_edges(
    rows: List[Dict], config: ImportConfig, warnings: List[str]
) -> List[ParsedEdge]:
    out: List[ParsedEdge] = []
    seen: Dict[tuple, int] = {}
    bk_cols = [str(e.get("col", "")).strip() for e in config.edge.businessKey]
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    for i, row in enumerate(rows, start=2):  # 表头占第 1 行
        source = _str(row.get("source"))
        target = _str(row.get("target"))
        link_type = _str(row.get("linkType"))
        if not (source and target and link_type):
            warnings.append(f"edges row {i}: missing source/target/linkType, skipped")
            continue
        label = _str(row.get("label"))
        # 公共属性：time 固定为边的更新时间（程序写入，不取自输入列）
        time = now
        props = {
            k: norm_value(v)
            for k, v in row.items()
            if k not in EDGE_RESERVED and str(v).strip() != ""
        }
        bk_values = [_str(row.get(c)) for c in bk_cols]
        key = (link_type, source, target, "|".join(bk_values))
        if config.edge.insertMode == "insert":
            rank = seen.get(key, 0)
            seen[key] = rank + 1
        else:
            rank = 0  # update 模式恒 0（幂等去重）
        eid = _str(row.get("id"))
        if not eid:
            eid = _sha1(link_type, source, target, "|".join(bk_values), str(rank))
        out.append(
            ParsedEdge(
                id=eid,
                source=source,
                target=target,
                linkType=link_type,
                label=label,
                time=time,
                rank=rank,
                props=props,
            )
        )
    return out


def map_tables(tables: Table, config: ImportConfig) -> ParsedGraph:
    warnings: List[str] = []
    entities = map_entities(tables.get("entities", []), config, warnings)
    edges = map_edges(tables.get("edges", []), config, warnings)
    return ParsedGraph(entities=entities, edges=edges, warnings=warnings)
