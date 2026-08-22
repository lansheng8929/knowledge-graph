"""graph-ingestion 应用装配。

路由：
  POST /api/v1/ingest/nodes   批量写入节点（强制打标）
  POST /api/v1/ingest/links   批量写入关系（强制打标）
  GET  /health /healthz
"""

import re
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from neo4j import GraphDatabase

from service_common.errors import register_exception_handler

from . import intimacy as intimacy_mod
from . import models as m
from .config import settings
from .tags import TagValidationError, validate_tags

_IDENTIFIER_RE = re.compile(r"^[A-Za-z0-9_\u4e00-\u9fa5]+$")


@asynccontextmanager
async def lifespan(app: FastAPI):
    driver = GraphDatabase.driver(
        settings.neo4j_uri,
        auth=(settings.neo4j_user, settings.neo4j_password),
        max_connection_pool_size=settings.max_pool_size,
    )
    app.state.driver = driver
    try:
        with driver.session() as session:
            session.run("RETURN 1")
        print("[warmup] Neo4j connected")
    except Exception as e:  # noqa: BLE001
        print(f"[warmup] Neo4j not ready: {e}")
    yield
    driver.close()


def _node_tags(n: m.IngestNode) -> dict:
    return {
        "tenantId": n.tenantId,
        "classification": n.classification,
        "owner": n.owner,
        "visibility": n.visibility,
        "ownerUid": n.ownerUid,
    }


def _link_tags(l: m.IngestLink) -> dict:
    return {
        "tenantId": l.tenantId,
        "classification": l.classification,
        "owner": l.owner,
        "visibility": l.visibility,
        "ownerUid": l.ownerUid,
    }


def create_app() -> FastAPI:
    app = FastAPI(
        title="Knowledge Graph Ingestion Service",
        version=settings.service_version,
        lifespan=lifespan,
    )
    register_exception_handler(app)
    if settings.cors_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=list(settings.cors_origins),
            allow_methods=["*"],
            allow_headers=["*"],
        )

    def health() -> dict:
        return {
            "status": "ok",
            "service": settings.service_name,
            "version": settings.service_version,
        }

    app.add_api_route("/health", health, methods=["GET"])
    app.add_api_route("/healthz", health, methods=["GET"])

    # ── 写入端点 ──────────────────────────────────────

    def ingest_nodes(req: m.IngestNodesRequest, request: Request) -> dict:
        driver = request.app.state.driver
        # T3.1.4：主体属性上下文（Phase 4 网关注入 X-User-Context 后接 PEP 校验）
        subject = request.headers.get("X-User-Context", "") or "unknown"
        imported = 0
        with driver.session() as session:
            for n in req.nodes:
                # 强制打标（T3.1.2）：缺标/非法 → 400 拒绝入库
                try:
                    validate_tags(_node_tags(n))
                except TagValidationError as e:
                    raise HTTPException(status_code=400, detail=f"node {n.id}: {e}")
                if not _IDENTIFIER_RE.match(n.nodeType):
                    raise HTTPException(
                        status_code=400, detail=f"node {n.id}: invalid nodeType"
                    )
                props = {
                    "label": n.label,
                    "icon": n.icon,
                    "tenantId": n.tenantId,
                    "classification": n.classification,
                    "owner": n.owner,
                    "visibility": n.visibility,
                    "ownerUid": n.ownerUid,
                    **n.props,
                }
                session.run(
                    f"MERGE (n:{n.nodeType} {{id: $id}}) SET n += $props",
                    id=n.id,
                    props=props,
                )
                imported += 1
        return {
            "success": True,
            "data": {"imported": imported, "skipped": 0, "subject": subject},
        }

    def ingest_links(req: m.IngestLinksRequest, request: Request) -> dict:
        driver = request.app.state.driver
        subject = request.headers.get("X-User-Context", "") or "unknown"
        imported = 0
        with driver.session() as session:
            for l in req.links:
                try:
                    validate_tags(_link_tags(l))
                except TagValidationError as e:
                    raise HTTPException(status_code=400, detail=f"link {l.id}: {e}")
                if not _IDENTIFIER_RE.match(l.linkType):
                    raise HTTPException(
                        status_code=400, detail=f"link {l.id}: invalid linkType"
                    )
                props = {
                    "label": l.label,
                    "time": l.time,
                    "rank": l.rank,
                    "tenantId": l.tenantId,
                    "classification": l.classification,
                    "owner": l.owner,
                    "visibility": l.visibility,
                    "ownerUid": l.ownerUid,
                    # T3.1：边自有属性（rank/业务属性等）一并入库，供查询/渲染
                    **l.props,
                }
                session.run(
                    f"""
                    MATCH (s {{id: $source}})
                    MATCH (t {{id: $target}})
                    MERGE (s)-[r:{l.linkType} {{id: $id}}]->(t)
                    SET r += $props
                    """,
                    source=l.source,
                    target=l.target,
                    id=l.id,
                    props=props,
                )
                imported += 1
        return {
            "success": True,
            "data": {"imported": imported, "skipped": 0, "subject": subject},
        }

    app.add_api_route(
        "/api/v1/ingest/nodes",
        ingest_nodes,
        methods=["POST"],
        response_model=m.IngestResult,
    )
    app.add_api_route(
        "/api/v1/ingest/links",
        ingest_links,
        methods=["POST"],
        response_model=m.IngestResult,
    )

    # ── 亲密度计算（v2 多维引擎）────────────────────────
    # 配置从 INTIMACY_CONFIG 加载（变更后触发重算即可刷新）
    intimacy_cfg = intimacy_mod.load_config(settings.intimacy_config_json)

    def compute_intimacy(req: m.IntimacyRequest, request: Request) -> dict:
        driver = request.app.state.driver
        intimacies, stats = intimacy_mod.compute_intimacy(driver, req.edges, intimacy_cfg)
        return {
            "success": True,
            "data": {"intimacies": intimacies, "stats": stats},
        }

    # 注意：不加 response_model——否则 FastAPI 会过滤掉 {success,data} 包装，
    # 客户端（writer.compute_intimacy 读 resp.json()["data"]）会取不到 data。
    app.add_api_route(
        "/api/v1/ingest/compute-intimacy",
        compute_intimacy,
        methods=["POST"],
    )

    # ── 亲密度重算（可更新：按当前配置刷新库中边）───────

    def recompute_intimacy(req: m.RecomputeIntimacyRequest, request: Request) -> dict:
        driver = request.app.state.driver
        updated = intimacy_mod.recompute_intimacy(driver, intimacy_cfg, req)
        return {"success": True, "data": {"updated": updated}}

    app.add_api_route(
        "/api/v1/ingest/recompute-intimacy",
        recompute_intimacy,
        methods=["POST"],
    )

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host=settings.host, port=settings.port)
