"""file-import-service 应用装配。

路由：
  POST /api/v1/import/files      multipart 上传(单个 file + config + template_id) → 一个后台导入任务（一个文件一个任务）
  POST /api/v1/import/preview    单个 file 解析 + 校验不写库，返回预览（可选 template_id 走模板）
  GET  /api/v1/import/tasks/{id} 任务状态 / 进度 / 报告
  GET  /api/v1/import/tasks      历史任务列表（摘要，按创建时间倒序）
  GET  /api/v1/import/formats    支持的格式 + 表头约定
  GET  /api/v1/import/options    按当前登录用户权限返回可配置项（默认值 + 约束）
  GET  /api/v1/import/templates  解析模板列表（内置种子）
  GET  /health /healthz
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from dataclasses import asdict
from typing import Optional, Tuple

from fastapi import (
    BackgroundTasks,
    FastAPI,
    File,
    Form,
    HTTPException,
    Request,
    UploadFile,
)
from fastapi.middleware.cors import CORSMiddleware

from . import models as m
from .config import settings
from .mapper import map_tables
from .parsers import get_parser, supported_extensions
from .permissions import (
    check_tags_permitted,
    import_options,
    subject_from_request,
)
from .tasks import create_task_store, task_visible_to
from .templates.engine import get_template, list_templates, parse_with_template
from .validator import validate
from .writer import IngestionClient

store = create_task_store(settings.task_store, settings.pg_dsn)


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="Knowledge Graph File Import Service",
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

    def health() -> dict:
        return {
            "status": "ok",
            "service": settings.service_name,
            "version": settings.service_version,
        }

    app.add_api_route("/health", health, methods=["GET"])
    app.add_api_route("/healthz", health, methods=["GET"])

    # ── 解析 → 映射 → 校验（preview 与 import 共享）─────

    def _parse_tables(
        entities: Optional[Tuple[str, bytes]],
        edges: Optional[Tuple[str, bytes]],
        config: m.ImportConfig,
    ) -> dict:
        tables: dict = {}
        sheet_mapping = config.sheetMapping
        if entities is not None:
            name, raw = entities
            parser = get_parser(name)
            kind = "entities"
            # 单文件 CSV：按表头自动判别（含 source/target/linkType → 边表）
            if name.lower().endswith(".csv"):
                rows = parser.parse(raw, name, kind="entities", sheet_mapping=None).get(
                    "entities", []
                )
                headers = {str(h).lower() for h in (rows[0].keys() if rows else [])}
                if {"source", "target", "linktype"} <= headers:
                    kind = "edges"
            tables.update(
                parser.parse(raw, name, kind=kind, sheet_mapping=sheet_mapping)
            )
        if edges is not None:
            name, raw = edges
            tables.update(
                get_parser(name).parse(
                    raw, name, kind="edges", sheet_mapping=sheet_mapping
                )
            )
        if not tables:
            raise HTTPException(status_code=400, detail="no entities/edges data found")
        return tables

    def _parse_uploaded(
        entities: Optional[Tuple[str, bytes]],
        edges: Optional[Tuple[str, bytes]],
        config: m.ImportConfig,
        template_id: Optional[str],
    ) -> tuple:
        """按模板或标准列名解析上传文件 → (Table, template_warnings)。

        模板（含 entityRule/edgeRule）→ 模板引擎（选表 + 列重映射，不做位置兜底）；
        否则（裸上传 / 通用模板）→ 标准列名直配，行为与旧版一致。
        """
        template = get_template(template_id) if template_id else None
        if template and (template.get("entityRule") or template.get("edgeRule")):
            warnings: list = []
            try:
                tables = parse_with_template(entities, edges, template, warnings)
            except m.ParseError as e:
                raise HTTPException(status_code=400, detail=str(e)) from e
            return tables, warnings
        return _parse_tables(entities, edges, config), []

    async def _read_upload(f: Optional[UploadFile]) -> Optional[Tuple[str, bytes]]:
        if f is None:
            return None
        raw = await f.read()
        if len(raw) > settings.max_file_bytes:
            raise HTTPException(status_code=413, detail=f"file too large: {f.filename}")
        return (f.filename or "", raw)

    # ── 预览（不写库）─────────────────────────────────

    async def preview(
        request: Request,
        file: Optional[UploadFile] = File(None),
        config: Optional[str] = Form(None),
        template_id: Optional[str] = Form(None),
    ) -> dict:
        cfg = m.parse_config(config)
        subject, authenticated = subject_from_request(request)
        tag_errors = check_tags_permitted(cfg.tags.model_dump(), subject, authenticated)
        if tag_errors:
            raise HTTPException(
                status_code=403, detail="permission denied: " + "; ".join(tag_errors)
            )
        ent = await _read_upload(file)
        if ent is None:
            raise HTTPException(status_code=400, detail="require a file")
        tables, twarn = _parse_uploaded(ent, None, cfg, template_id)
        graph = map_tables(tables, cfg)
        graph.warnings = twarn + graph.warnings
        result = validate(graph, cfg)
        limit = settings.preview_limit
        return {
            "success": True,
            "data": {
                "entityCount": len(result.entities),
                "edgeCount": len(result.edges),
                "skipped": result.skipped,
                "entities": [asdict(e) for e in result.entities[:limit]],
                "edges": [asdict(e) for e in result.edges[:limit]],
                "errors": result.errors[:limit],
                "warnings": result.warnings[:limit],
            },
        }

    app.add_api_route("/api/v1/import/preview", preview, methods=["POST"])

    # ── 导入（后台任务）───────────────────────────────

    def _run_import(
        task_id: str,
        entities: Optional[Tuple[str, bytes]],
        edges: Optional[Tuple[str, bytes]],
        config_str: Optional[str],
        template_id: Optional[str],
        subject_raw: str,
        subject: dict,
        authenticated: bool,
    ) -> None:
        store.set_stage(task_id, "parsing")
        try:
            cfg = m.parse_config(config_str)
            tag_data = cfg.tags.model_dump()
            tag_errors = check_tags_permitted(tag_data, subject, authenticated)
            if tag_errors:
                store.fail(
                    task_id,
                    "permission denied: " + "; ".join(tag_errors),
                )
                return
            # 属主 uid 由服务端注入（不可由客户端伪造），供“内部=自己及下级”可见性匹配
            tag_data["ownerUid"] = str(subject.get("uid", ""))
            cfg.tags = m.TagConfig(**tag_data)
            tables, twarn = _parse_uploaded(entities, edges, cfg, template_id)
            graph = map_tables(tables, cfg)
            graph.warnings = twarn + graph.warnings
            result = validate(graph, cfg)
            store.set_entity_ids(task_id, [e.id for e in result.entities])
            if result.errors:
                store.finish(task_id, 0, result.skipped, result.warnings, result.errors)
                return
            store.set_stage(task_id, "writing")
            client = IngestionClient(settings.ingestion_base_url)
            tags = cfg.tags.model_dump()
            imp_n, skip_n, err_n = client.ingest_nodes(
                result.entities, tags, chunk=settings.write_chunk, subject=subject_raw
            )
            imp_l, skip_l, err_l = client.ingest_links(
                result.edges, tags, chunk=settings.write_chunk, subject=subject_raw
            )
            store.finish(
                task_id,
                imp_n + imp_l,
                result.skipped + skip_n + skip_l,
                result.warnings,
                result.errors + err_n + err_l,
            )
        except Exception as e:  # noqa: BLE001
            store.fail(task_id, str(e))

    async def import_files(
        request: Request,
        background: BackgroundTasks,
        file: Optional[UploadFile] = File(None),
        config: Optional[str] = Form(None),
        template_id: Optional[str] = Form(None),
    ) -> dict:
        ent = await _read_upload(file)
        if ent is None:
            raise HTTPException(status_code=400, detail="require a file")
        subject_raw = request.headers.get("X-User-Context", "")
        subject, authenticated = subject_from_request(request)
        task = store.create(
            filename=ent[0],
            owner=str(subject.get("username", "")),
            owner_uid=str(subject.get("uid", "")),
            tenant_id=str(subject.get("tenantId", "default")),
        )
        background.add_task(
            _run_import,
            task.id,
            ent,
            None,
            config,
            template_id,
            subject_raw,
            subject,
            authenticated,
        )
        return {"success": True, "data": {"taskId": task.id}}

    app.add_api_route("/api/v1/import/files", import_files, methods=["POST"])

    # ── 解析模板（内置种子；后续 CRUD/共享/审批走业务库）──

    def import_templates_route() -> dict:
        return {"success": True, "data": list_templates()}

    app.add_api_route(
        "/api/v1/import/templates", import_templates_route, methods=["GET"]
    )

    # ── 可配置选项（按当前登录用户权限）────────────────

    def import_options_route(request: Request) -> dict:
        subject, _ = subject_from_request(request)
        return {"success": True, "data": import_options(subject)}

    app.add_api_route("/api/v1/import/options", import_options_route, methods=["GET"])

    # ── 任务状态 ──────────────────────────────────────

    def get_task(task_id: str, request: Request) -> dict:
        task = store.get(task_id)
        if task is None:
            raise HTTPException(status_code=404, detail=f"task not found: {task_id}")
        subject, authenticated = subject_from_request(request)
        # 已鉴权时只允许看属主范围（自己及以下）的任务
        if authenticated and not task_visible_to(task, subject):
            raise HTTPException(status_code=404, detail=f"task not found: {task_id}")
        return {"success": True, "data": task.to_dict()}

    app.add_api_route("/api/v1/import/tasks/{task_id}", get_task, methods=["GET"])

    # ── 历史任务列表（结果 tab 查看历史；按属主范围过滤）──

    def list_tasks(request: Request) -> dict:
        subject, authenticated = subject_from_request(request)
        tasks = store.list(limit=50, subject=subject, authenticated=authenticated)
        return {"success": True, "data": [t.summary_dict() for t in tasks]}

    app.add_api_route("/api/v1/import/tasks", list_tasks, methods=["GET"])

    # ── 格式说明 ──────────────────────────────────────

    def formats() -> dict:
        return {
            "success": True,
            "data": {
                "extensions": supported_extensions(),
                "tables": ["entities", "edges"],
                "entityHeader": "id | nodeType | label | icon | <props...>",
                "edgeHeader": "id | source | target | linkType | label | time | rank | <props...>",
                "notes": [
                    "Excel: entities/edges 两个 sheet；CSV: 单文件按表头自动判别",
                    "edges.time = 边的更新时间（程序写入，固定为导入/更新时刻，不配置）",
                    "edges.rank = 公共序号（update 模式恒 0；insert 模式递增）",
                    "业务时间（如转账时间）放 props（如 transTime）",
                    "TXT/Word/LLM 解析为后续阶段（P2/P4）",
                ],
            },
        }

    app.add_api_route("/api/v1/import/formats", formats, methods=["GET"])

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=settings.host, port=settings.port)
