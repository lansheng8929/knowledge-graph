"""
Neo4j Graph Query Engine — 替代 Vite mock API 的 Python 查询服务

启动方式：
  1. docker compose up -d        # 启动 Neo4j
  2. pip install fastapi uvicorn neo4j
  3. python neo4j-server.py      # 启动 API 服务（默认 8001 端口）

Vite 配置代理到本服务：
  server.proxy: { "/api": "http://localhost:8001" }
"""

import os
import json
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from neo4j import GraphDatabase, basic_auth
from pydantic import BaseModel

# ─── 配置 ────────────────────────────────────────────

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password123")
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8001"))


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """启动时预热连接并创建索引"""
    with driver.session() as session:
        session.run("RETURN 1")
        session.run("CREATE INDEX IF NOT EXISTS FOR (n:person) ON (n.id)")
        session.run("CREATE INDEX IF NOT EXISTS FOR (n:person) ON (n.label)")
        session.run("CREATE INDEX IF NOT EXISTS FOR (n:phone) ON (n.id)")
        session.run("CREATE INDEX IF NOT EXISTS FOR (n:phone) ON (n.label)")
        session.run("CREATE INDEX IF NOT EXISTS FOR (n:address) ON (n.id)")
        session.run("CREATE INDEX IF NOT EXISTS FOR (n:account) ON (n.id)")
        session.run("CREATE INDEX IF NOT EXISTS FOR (n:company) ON (n.id)")
        session.run("CREATE INDEX IF NOT EXISTS FOR (n:ip) ON (n.id)")
        session.run("CREATE INDEX IF NOT EXISTS FOR (n:device) ON (n.id)")
    print("[warmup] Neo4j connected, indexes ready")
    yield


app = FastAPI(title="Knowledge Graph Neo4j Engine", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

driver = GraphDatabase.driver(NEO4J_URI, auth=basic_auth(NEO4J_USER, NEO4J_PASSWORD))


# ─── API ─────────────────────────────────────────────


class InitRequest(BaseModel):
    ids: List[str] = []


class ExpandRequest(BaseModel):
    sourceNodeId: str
    ruleId: str
    existingNodeIds: List[str] = []
    existingLinkIds: List[str] = []
    conditions: Optional[str] = None


def get_neighbor_summary(node_id: str) -> dict:
    """查询节点的邻居类型、方向及数量"""
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
        summary = {}
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


def _node_to_obj(record):
    """将 Neo4j 节点记录转为前端 GraphNode 格式"""
    n = record["n"]
    labels = record["labels"]
    node_type = labels[0] if labels else "default"
    node_data = dict(n)
    node_id = node_data.pop("id")

    extra_keys = [k for k in node_data if k not in ("nodeType", "label", "icon")]
    extra = {k: node_data[k] for k in extra_keys}
    for k in extra_keys:
        del node_data[k]

    neighbors = get_neighbor_summary(node_id)
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


@app.post("/api/graph/init")
def init_graph(req: InitRequest):
    """
    根据 ids 加载初始节点。
    - 传入 ids: 查询指定节点
    - 不传 ids 或空数组: 返回空图
    """
    ids = req.ids

    if not ids:
        return {
            "success": True,
            "data": {
                "graphData": {"nodes": [], "links": []},
            },
        }

    with driver.session() as session:
        nodes = []
        for nid in ids:
            result = session.run(
                "MATCH (n {id: $nid}) RETURN n, labels(n) AS labels",
                nid=nid,
            )
            record = result.single()
            if record:
                nodes.append(_node_to_obj(record))

    return {
        "success": True,
        "data": {
            "graphData": {"nodes": nodes, "links": []},
        },
    }


class SearchRequest(BaseModel):
    query: str
    limit: int = 10


@app.post("/api/graph/search")
def search_nodes(req: SearchRequest):
    """模糊搜索节点 label / id"""
    with driver.session() as session:
        result = session.run(
            """
            MATCH (n)
            WHERE n.label CONTAINS $q
            RETURN n, labels(n) AS labels
            LIMIT $limit
            """,
            q=req.query,
            limit=req.limit,
        )
        nodes = [_node_to_obj(record) for record in result]

    return {"success": True, "data": {"nodes": nodes}}


@app.post("/api/graph/expand")
def expand_graph(req: ExpandRequest):
    """执行拓出操作"""
    with driver.session() as session:
        if not req.conditions:
            print("[ERROR] No conditions provided")
            raise HTTPException(status_code=400, detail="No conditions provided")

        # ── 解析 JSON conditions，构建动态查询 ──
        try:
            conds = json.loads(req.conditions)
        except json.JSONDecodeError:
            print(f"[ERROR] Invalid conditions JSON: {req.conditions[:200]}")
            raise HTTPException(status_code=400, detail="Invalid conditions JSON")

        query_parts = []
        all_params = {
            "sourceId": req.sourceNodeId,
            "existLinkIds": req.existingLinkIds,
            "existNodeIds": req.existingNodeIds,
        }

        for ci, cond in enumerate(conds):
            rel_type = cond.get("relationType", "")
            target_type = cond.get("targetType", "")
            direction = cond.get("direction", "out")
            filters = cond.get("filters", [])

            if not rel_type or not target_type:
                continue

            # 方向: "out" 表示从 source 出发的出边, "in" 表示指向 source 的入边
            if direction == "in":
                match_clause = f"(source {{id: $sourceId}})<-[r:{rel_type}]-(target)"
            else:
                match_clause = f"(source {{id: $sourceId}})-[r:{rel_type}]->(target)"

            where_clauses = [
                "NOT r.id IN $existLinkIds",
                "NOT target.id IN $existNodeIds",
                f"${target_type}_label IN labels(target)",
            ]
            all_params[f"{target_type}_label"] = target_type

            # 属性过滤器
            for fi, f in enumerate(filters):
                prop = f.get("property", "")
                op = f.get("operator", "")
                val = f.get("value", "")
                if not prop or not op:
                    continue
                param_key = f"f{ci}_{fi}"
                if op == "eq":
                    where_clauses.append(f"target.{prop} = ${param_key}")
                    all_params[param_key] = val
                elif op == "neq":
                    where_clauses.append(f"target.{prop} <> ${param_key}")
                    all_params[param_key] = val
                elif op == "contains":
                    where_clauses.append(f"target.{prop} CONTAINS ${param_key}")
                    all_params[param_key] = val
                elif op == "starts":
                    where_clauses.append(f"target.{prop} STARTS WITH ${param_key}")
                    all_params[param_key] = val
                elif op == "gt":
                    where_clauses.append(f"target.{prop} > ${param_key}")
                    all_params[param_key] = val
                elif op == "gte":
                    where_clauses.append(f"target.{prop} >= ${param_key}")
                    all_params[param_key] = val
                elif op == "lt":
                    where_clauses.append(f"target.{prop} < ${param_key}")
                    all_params[param_key] = val
                elif op == "lte":
                    where_clauses.append(f"target.{prop} <= ${param_key}")
                    all_params[param_key] = val

            where_str = " AND ".join(where_clauses)
            query_parts.append(
                f"MATCH {match_clause}\nWHERE {where_str}\n"
                f"RETURN r, startNode(r) AS relSource, endNode(r) AS relTarget, "
                f"type(r) AS relType, "
                f"labels(startNode(r)) AS sourceLabels, labels(endNode(r)) AS targetLabels"
            )

        if not query_parts:
            print(f"[ERROR] No valid conditions in request: {req.conditions[:200]}")
            raise HTTPException(status_code=400, detail="No valid conditions")

        # UNION ALL 合并多条条件
        combined_query = "\nUNION ALL\n".join(query_parts)
        query = combined_query
        params = all_params

        result = session.run(query, params)

        all_records = list(result)
        total = len(all_records)
        paged = all_records

        result_nodes = []
        result_links = []
        seen_node_ids = set(req.existingNodeIds)

        for record in paged:
            r = dict(record["r"])
            link_id = r.pop("id")
            link_label = r.pop("label", "")
            link_time = r.pop("time", "")
            rel_type = record["relType"]
            source_labels = record.get("sourceLabels", [])
            target_labels = record.get("targetLabels", [])

            # 直接用 Neo4j 关系的起止节点
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

            # 边两端节点（去重）
            node_label_map = {source_id: source_labels, target_id: target_labels}
            for nid, ndata in [(source_id, source_node), (target_id, target_node)]:
                if nid not in seen_node_ids:
                    seen_node_ids.add(nid)
                    lbls = node_label_map.get(nid, [])
                    node_type = lbls[0] if lbls else "default"
                    extra_keys = [
                        k for k in ndata if k not in ("nodeType", "label", "icon")
                    ]
                    extra = {k: ndata[k] for k in extra_keys}
                    node_neighbors = get_neighbor_summary(nid)
                    result_nodes.append(
                        {
                            "id": nid,
                            "data": {
                                "nodeType": node_type,
                                "label": ndata.get("label", ""),
                                "icon": ndata.get("icon", ""),
                                "count": 0,
                                "total": 0,
                                "neighbors": node_neighbors,
                                **extra,
                            },
                        }
                    )

    return {
        "success": True,
        "data": {
            "nodes": result_nodes,
            "links": result_links,
            "total": total,
            "hasMore": False,
            "rulesMap": {},
        },
    }


class AnalysisRequest(BaseModel):
    nodeIds: List[str]
    type: str = "call_circle"
    timeWindow: Optional[str] = None  # 例如 "1d", "7d", "30d"


@app.post("/api/graph/analyze")
async def analyze_node(req: AnalysisRequest):
    """分析节点"""
    print(f"[analyze] nodeIds={req.nodeIds}, type={req.type}")
    with driver.session() as session:
        if req.type == "call_circle":
            results = []
            result_nodes = []
            result_links = []
            seen_ids = set()

            for nid in req.nodeIds:
                time_filter = ""
                params = {"nodeId": nid}
                if req.timeWindow:
                    # timeWindow 格式: "1d" / "7d" / "30d" — Python 层计算截止时间
                    from datetime import datetime, timedelta

                    days = int(req.timeWindow.replace("d", ""))
                    cutoff = (datetime.now() - timedelta(days=days)).strftime(
                        "%Y-%m-%d"
                    )
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

                    # 边数据
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

                    # 目标节点
                    if other_id not in seen_ids:
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
                "success": True,
                "data": {
                    "type": "call_circle",
                    "items": results,
                    "graphData": {"nodes": result_nodes, "links": result_links},
                },
            }

    return {"success": True, "data": {"type": req.type, "items": []}}


@app.get("/health")
def health():
    return {"status": "ok"}


# ─── 启动 ────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=HOST, port=PORT)
