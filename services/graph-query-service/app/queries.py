"""Neo4j 查询逻辑（与 FastAPI 装配解耦，driver 由依赖注入）。

由 vite-test/neo4j-server.py 迁移重构（T1.1.1），行为保持一致：
- init / search / expand / analyze
- Cypher 由受控模板生成，标识符/操作符经 validator 白名单校验。
"""

from typing import Any, Dict, List, Optional

from neo4j import Driver

from . import models as m
from .masking import mask_sensitive
from .pep import l3_conditions, l3_visible
from .validator import normalize_conditions, parse_conditions


# ── 公共工具 ──────────────────────────────────────────


def get_neighbor_summary(driver: Driver, node_id: str) -> Dict[str, Any]:
    """查询节点的邻居类型、方向及数量（保持原结构）。"""
    with driver.session() as session:
        out_result = session.run(
            """
            MATCH (n {id: $nodeId})-[r]->(target)
            RETURN type(r) AS relType, COALESCE(target.nodeType, head(labels(target))) AS targetType, count(r) AS cnt
            """,
            nodeId=node_id,
        )
        in_result = session.run(
            """
            MATCH (n {id: $nodeId})<-[r]-(target)
            RETURN type(r) AS relType, COALESCE(target.nodeType, head(labels(target))) AS targetType, count(r) AS cnt
            """,
            nodeId=node_id,
        )
        summary: Dict[str, Any] = {}
        for records, direction in [(out_result, "out"), (in_result, "in")]:
            for record in records:
                rel = record["relType"]
                ttype = record["targetType"]
                cnt = record["cnt"]
                if ttype not in summary:
                    summary[ttype] = {}
                if rel not in summary[ttype]:
                    summary[ttype][rel] = {"out": 0, "in": 0, "total": 0}
                summary[ttype][rel][direction] = cnt
                summary[ttype][rel]["total"] += cnt
        return summary


def node_to_obj(
    driver: Driver,
    record: Any,
    subject: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """将 Neo4j 节点记录转为前端 GraphNode 格式（保持原结构）。L4：敏感字段脱敏。"""
    n = record["n"]
    labels = record["labels"]
    node_type = labels[0] if labels else "default"
    node_data = dict(n)
    node_id = node_data.pop("id")

    # L4（T4.7）：敏感字段按主体掩码
    if subject:
        node_data = mask_sensitive(node_type, node_data, subject)

    extra_keys = [k for k in node_data if k not in ("nodeType", "label", "icon")]
    extra = {k: node_data[k] for k in extra_keys}
    for k in extra_keys:
        del node_data[k]

    neighbors = get_neighbor_summary(driver, node_id)
    return {
        "id": node_id,
        "data": {
            "nodeType": node_type,
            "label": node_data.get("label", ""),
            "icon": node_data.get("icon", ""),
            "count": 0,
            "total": 0,
            "neighbors": neighbors,
            **extra,
        },
    }


# ── init ──────────────────────────────────────────────


def query_init(
    driver: Driver, ids: List[str], subject: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """根据 ids 加载初始节点；空数组返回空图。L3：按主体过滤不可见节点。"""
    if not ids:
        return {"graphData": {"nodes": [], "links": []}}

    where, params = l3_conditions(subject or {}, "n")
    nodes: List[Dict[str, Any]] = []
    with driver.session() as session:
        for nid in ids:
            result = session.run(
                f"MATCH (n {{id: $nid}}) WHERE {where} RETURN n, labels(n) AS labels",
                nid=nid,
                **params,
            )
            record = result.single()
            if record:
                obj = node_to_obj(driver, record, subject)
                # L3 投影过滤（返回后双保险）
                if l3_visible(obj["data"], subject):
                    nodes.append(obj)

    return {"graphData": {"nodes": nodes, "links": []}}


# ── search ────────────────────────────────────────────


def query_search(
    driver: Driver,
    query: str,
    limit: int,
    subject: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """模糊搜索节点 label / id。L3：按主体过滤不可见节点。"""
    where, params = l3_conditions(subject or {}, "n")
    nodes: List[Dict[str, Any]] = []
    with driver.session() as session:
        result = session.run(
            f"""
            MATCH (n)
            WHERE n.label CONTAINS $q AND {where}
            RETURN n, labels(n) AS labels
            LIMIT $limit
            """,
            q=query,
            limit=limit,
            **params,
        )
        nodes = []
        for record in result:
            obj = node_to_obj(driver, record, subject)
            # L3 投影过滤（返回后双保险）
            if l3_visible(obj["data"], subject):
                nodes.append(obj)

    return {"nodes": nodes}


# ── expand（核心）─────────────────────────────────────


def _build_match_clause(cond: Dict[str, Any]) -> str:
    rel_type = cond["relationType"]
    direction = cond["direction"]
    if direction == "in":
        return f"(source {{id: $sourceId}})<-[r:{rel_type}]-(target)"
    return f"(source {{id: $sourceId}})-[r:{rel_type}]->(target)"


def _build_where_clause(
    cond: Dict[str, Any],
    all_params: Dict[str, Any],
    cond_idx: int,
    subject: Optional[Dict[str, Any]] = None,
) -> str:
    target_type = cond["targetType"]
    where_clauses = [
        "NOT r.id IN $existLinkIds",
        "NOT target.id IN $existNodeIds",
        f"${target_type}_label IN labels(target)",
    ]
    all_params[f"{target_type}_label"] = target_type

    # L3（T4.6）：target 数据级过滤（宽松：未打标放行，打标严格按租户+密级）
    t_where, t_params = l3_conditions(subject or {}, "target")
    where_clauses.append(t_where)
    all_params.update(t_params)

    for fi, f in enumerate(cond.get("filters", [])):
        prop = f["property"]
        op = f["operator"]
        val = f["value"]
        param_key = f"f{cond_idx}_{fi}"
        cypher_op = _OPERATOR_MAP[op]
        where_clauses.append(f"target.{prop} {cypher_op} ${param_key}")
        all_params[param_key] = val

    return " AND ".join(where_clauses)


_OPERATOR_MAP = {
    "eq": "=",
    "neq": "<>",
    "contains": "CONTAINS",
    "starts": "STARTS WITH",
    "gt": ">",
    "gte": ">=",
    "lt": "<",
    "lte": "<=",
}


def query_expand(
    driver: Driver,
    req: m.ExpandRequest,
    subject: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """执行拓出操作：多条件 UNION ALL 合并，边两端节点去重。L3：过滤不可见 target。"""
    conds = parse_conditions(req.conditions)
    normalized = normalize_conditions(conds)

    if not normalized:
        raise ValueError("No valid conditions")

    query_parts: List[str] = []
    all_params: Dict[str, Any] = {
        "sourceId": req.sourceNodeId,
        "existLinkIds": req.existingLinkIds,
        "existNodeIds": req.existingNodeIds,
    }

    for ci, cond in enumerate(normalized):
        match_clause = _build_match_clause(cond)
        where_str = _build_where_clause(cond, all_params, ci, subject)
        query_parts.append(
            f"MATCH {match_clause}\nWHERE {where_str}\n"
            f"RETURN r, startNode(r) AS relSource, endNode(r) AS relTarget, "
            f"type(r) AS relType, "
            f"labels(startNode(r)) AS sourceLabels, labels(endNode(r)) AS targetLabels"
        )

    combined_query = "\nUNION ALL\n".join(query_parts)

    result_nodes: List[Dict[str, Any]] = []
    result_links: List[Dict[str, Any]] = []
    seen_node_ids: set = set(req.existingNodeIds)

    with driver.session() as session:
        result = session.run(combined_query, all_params)
        all_records = list(result)
        total = len(all_records)

        for record in all_records:
            r = dict(record["r"])
            link_id = r.pop("id")
            link_label = r.pop("label", "")
            link_time = r.pop("time", "")
            rel_type = record["relType"]
            source_labels = record.get("sourceLabels", [])
            target_labels = record.get("targetLabels", [])

            source_node = dict(record["relSource"])
            target_node = dict(record["relTarget"])
            source_id = source_node.pop("id")
            target_id = target_node.pop("id")

            result_links.append(
                {
                    "id": link_id,
                    "source": source_id,
                    "target": target_id,
                    "data": {
                        "linkType": rel_type,
                        "label": link_label,
                        "time": link_time,
                    },
                }
            )

            node_label_map = {source_id: source_labels, target_id: target_labels}
            for nid, ndata in [(source_id, source_node), (target_id, target_node)]:
                if nid in seen_node_ids:
                    continue
                seen_node_ids.add(nid)
                lbls = node_label_map.get(nid, [])
                node_type = lbls[0] if lbls else "default"
                masked = mask_sensitive(node_type, dict(ndata), subject)
                extra_keys = [k for k in masked if k not in ("nodeType", "label", "icon")]
                extra = {k: masked[k] for k in extra_keys}
                node_neighbors = get_neighbor_summary(driver, nid)
                candidate = {
                    "id": nid,
                    "data": {
                        "nodeType": node_type,
                        "label": masked.get("label", ""),
                        "icon": masked.get("icon", ""),
                        "count": 0,
                        "total": 0,
                        "neighbors": node_neighbors,
                        **extra,
                    },
                }
                # L3 投影过滤（返回后双保险）
                if l3_visible(candidate["data"], subject):
                    result_nodes.append(candidate)

    return {
        "nodes": result_nodes,
        "links": result_links,
        "total": total,
        "hasMore": False,
        "rulesMap": {},
    }


# ── analyze ───────────────────────────────────────────


def query_analyze(driver: Driver, req: m.AnalysisRequest) -> Dict[str, Any]:
    """分析节点（call_circle 通话圈）。"""
    if req.type != "call_circle":
        return {"type": req.type, "items": []}

    from datetime import datetime, timedelta

    results: List[Dict[str, Any]] = []
    result_nodes: List[Dict[str, Any]] = []
    result_links: List[Dict[str, Any]] = []
    seen_ids: set = set()

    with driver.session() as session:
        for nid in req.nodeIds:
            time_filter = ""
            params: Dict[str, Any] = {"nodeId": nid}
            if req.timeWindow:
                days = int(req.timeWindow.replace("d", ""))
                cutoff = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
                time_filter = "AND r.time >= $cutoff"
                params["cutoff"] = cutoff

            result = session.run(
                f"""
                MATCH (n {{id: $nodeId}})-[r:CALLED]-(other:phone)
                WHERE r.time IS NOT NULL {time_filter}
                RETURN r, other, type(r) AS relType,
                       labels(other) AS otherLabels, count(r) AS callCount
                ORDER BY callCount DESC
                LIMIT 20
                """,
                **params,
            )
            for record in result:
                other = dict(record["other"])
                other_id = other.pop("id")
                r = dict(record["r"])
                link_id = r.pop("id")
                other_labels = record.get("otherLabels", [])
                other_type = other_labels[0] if other_labels else "phone"

                results.append(
                    {
                        "sourceId": nid,
                        "id": other_id,
                        "label": other.get("label", ""),
                        "relation": record["relType"],
                        "time": r.get("time", ""),
                        "count": record["callCount"],
                    }
                )
                result_links.append(
                    {
                        "id": link_id,
                        "source": nid,
                        "target": other_id,
                        "data": {
                            "linkType": record["relType"],
                            "label": r.get("label", ""),
                            "time": r.get("time", ""),
                        },
                    }
                )
                if other_id in seen_ids:
                    continue
                seen_ids.add(other_id)
                result_nodes.append(
                    {
                        "id": other_id,
                        "data": {
                            "nodeType": other_type,
                            "label": other.get("label", ""),
                            "icon": other.get("icon", ""),
                            "count": 0,
                            "total": 0,
                            **{
                                k: v
                                for k, v in other.items()
                                if k not in ("nodeType", "label", "icon")
                            },
                        },
                    }
                )

    return {
        "type": "call_circle",
        "items": results,
        "graphData": {"nodes": result_nodes, "links": result_links},
    }
