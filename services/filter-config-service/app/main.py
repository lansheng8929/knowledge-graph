"""filter-config-service：类型驱动的筛选配置（filter_schema）CRUD。

路由：
  GET    /api/v1/filter-schema       列出（可按 type_kind / type_name 过滤）
  POST   /api/v1/filter-schema       新增（需 admin 角色）
  PUT    /api/v1/filter-schema/{id}  更新（需 admin 角色）
  DELETE /api/v1/filter-schema/{id}  删除（需 admin 角色）
  GET    /health
"""
from __future__ import annotations

import json
from contextlib import asynccontextmanager
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from service_common.subject import subject_from_request

from .config import settings
from .db import connect, ensure_schema
from .seed import SEED_ROWS

ALLOWED_FILTER_TYPES = {"text", "select", "number_range", "date_range", "bool", "region"}


class FilterSchemaIn(BaseModel):
    type_kind: str
    type_name: str
    attr_key: str
    filter_type: str
    label: str
    unit: str = ""
    options: List[str] = Field(default_factory=list)
    sort_order: int = 0
    enabled: bool = True


def _subject(request: Request) -> tuple:
    return subject_from_request(
        request,
        default={"username": "", "uid": "anonymous", "tenantId": "default", "roles": ["admin"]},
        secret=settings.auth_secret,
        default_roles=[],
    )


def _validate(item: FilterSchemaIn) -> None:
    if item.type_kind not in ("node", "edge"):
        raise HTTPException(status_code=422, detail="type_kind must be node|edge")
    if item.filter_type not in ALLOWED_FILTER_TYPES:
        raise HTTPException(
            status_code=422,
            detail=f"filter_type must be one of {sorted(ALLOWED_FILTER_TYPES)}",
        )


def _require_admin(request: Request) -> None:
    subject, authenticated = _subject(request)
    # 已认证必须带 admin 角色；未认证（dev 直连）放行
    if authenticated and "admin" not in subject.get("roles", []):
        raise HTTPException(status_code=403, detail="permission denied: admin role required")


def _row_to_dict(r: Dict[str, Any]) -> Dict[str, Any]:
    options = r.get("options")
    return {
        "id": r["id"],
        "typeKind": r["type_kind"],
        "typeName": r["type_name"],
        "attrKey": r["attr_key"],
        "filterType": r["filter_type"],
        "label": r["label"],
        "unit": r.get("unit", ""),
        "options": json.loads(options) if isinstance(options, str) else (options or []),
        "sortOrder": r.get("sort_order", 0),
        "enabled": bool(r.get("enabled", True)),
    }


def _list_schemas(
    type_kind: Optional[str] = None,
    type_name: Optional[str] = None,
) -> List[Dict[str, Any]]:
    sql = "SELECT * FROM filter_schema WHERE 1=1"
    params: List[Any] = []
    if type_kind:
        sql += " AND type_kind = %s"
        params.append(type_kind)
    if type_name:
        sql += " AND type_name = %s"
        params.append(type_name)
    sql += " ORDER BY type_kind, type_name, sort_order, id"
    with connect(settings.pg_dsn) as conn:
        rows = conn.execute(sql, params).fetchall()
    return [_row_to_dict(r) for r in rows]


def _seed() -> None:
    with connect(settings.pg_dsn) as conn:
        for row in SEED_ROWS:
            conn.execute(
                """INSERT INTO filter_schema (type_kind, type_name, attr_key, filter_type, label, unit, options, sort_order)
                   VALUES (%(type_kind)s, %(type_name)s, %(attr_key)s, %(filter_type)s, %(label)s, %(unit)s, %(options)s, %(sort_order)s)
                   ON CONFLICT (type_kind, type_name, attr_key) DO NOTHING""",
                {**row, "options": json.dumps(row["options"], ensure_ascii=False)},
            )
        conn.commit()


def create_app() -> FastAPI:
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        # 建表 + 幂等种子（管理平台可增删改）
        ensure_schema(settings.pg_dsn)
        _seed()
        yield

    app = FastAPI(
        title="Knowledge Graph Filter Config Service",
        version=settings.service_version,
        lifespan=lifespan,
    )
    if settings.cors_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=list(settings.cors_origins),
            allow_methods=["*"],
            allow_headers=["*"],
        )

    @app.get("/health")
    @app.get("/healthz")
    def health() -> dict:
        return {
            "status": "ok",
            "service": settings.service_name,
            "version": settings.service_version,
        }

    @app.get("/api/v1/filter-schema")
    def get_schemas(
        type_kind: Optional[str] = Query(None),
        type_name: Optional[str] = Query(None),
    ) -> dict:
        return {"success": True, "data": _list_schemas(type_kind, type_name)}

    @app.post("/api/v1/filter-schema")
    def create_schema(item: FilterSchemaIn, request: Request) -> dict:
        _validate(item)
        _require_admin(request)
        with connect(settings.pg_dsn) as conn:
            try:
                cur = conn.execute(
                    """INSERT INTO filter_schema (type_kind, type_name, attr_key, filter_type, label, unit, options, sort_order, enabled)
                       VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *""",
                    (
                        item.type_kind,
                        item.type_name,
                        item.attr_key,
                        item.filter_type,
                        item.label,
                        item.unit,
                        json.dumps(item.options, ensure_ascii=False),
                        item.sort_order,
                        item.enabled,
                    ),
                )
                row = cur.fetchone()
                conn.commit()
            except Exception as e:  # noqa: BLE001
                conn.rollback()
                if "unique" in str(e).lower():
                    raise HTTPException(status_code=409, detail="duplicate (type_kind, type_name, attr_key)") from e
                raise
        return {"success": True, "data": _row_to_dict(row)}

    @app.put("/api/v1/filter-schema/{schema_id}")
    def update_schema(schema_id: int, item: FilterSchemaIn, request: Request) -> dict:
        _validate(item)
        _require_admin(request)
        with connect(settings.pg_dsn) as conn:
            cur = conn.execute(
                """UPDATE filter_schema
                   SET type_kind=%s, type_name=%s, attr_key=%s, filter_type=%s, label=%s, unit=%s,
                       options=%s, sort_order=%s, enabled=%s, updated_at=now()
                   WHERE id=%s RETURNING *""",
                (
                    item.type_kind,
                    item.type_name,
                    item.attr_key,
                    item.filter_type,
                    item.label,
                    item.unit,
                    json.dumps(item.options, ensure_ascii=False),
                    item.sort_order,
                    item.enabled,
                    schema_id,
                ),
            )
            row = cur.fetchone()
            conn.commit()
        if row is None:
            raise HTTPException(status_code=404, detail=f"filter_schema {schema_id} not found")
        return {"success": True, "data": _row_to_dict(row)}

    @app.delete("/api/v1/filter-schema/{schema_id}")
    def delete_schema(schema_id: int, request: Request) -> dict:
        _require_admin(request)
        with connect(settings.pg_dsn) as conn:
            cur = conn.execute(
                "DELETE FROM filter_schema WHERE id=%s RETURNING id",
                (schema_id,),
            )
            row = cur.fetchone()
            conn.commit()
        if row is None:
            raise HTTPException(status_code=404, detail=f"filter_schema {schema_id} not found")
        return {"success": True, "data": {"deleted": schema_id}}

    return app


app = create_app()
