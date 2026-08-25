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

import os
import shutil
import tempfile
from contextlib import asynccontextmanager
from dataclasses import asdict
from typing import Optional, Tuple

from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from service_common.errors import register_exception_handler
from service_common.logging import setup_logging

from . import models as m
from .config import settings
from .mapper import map_tables
from .parsers import get_parser, supported_extensions
from .permissions import (
    check_tags_permitted,
    import_options,
    subject_from_request,
)
from .pipeline import PipelineAbort, SubtaskSpec, register_subtask, run_pipeline
from .queue import TaskQueue, create_task_queue
from .tasks import create_task_store, task_visible_to
from .templates.engine import get_template, list_templates, parse_with_template
from .validator import validate
from .writer import IngestionClient

store = create_task_store(settings.task_store, settings.pg_dsn)

# 默认主任务流水线：A 解析实体/边 → B 全库计算亲密度（未来可调步骤/入参/顺序）
DEFAULT_STEPS = ["parse", "compute_intimacy"]

_TEMP_PREFIX = "kg-import-"


def _temp_dir(task_id: str) -> str:
    return os.path.join(tempfile.gettempdir(), f"{_TEMP_PREFIX}{task_id}")


def _save_temp(task_id: str, name: str, raw: bytes) -> str:
    """上传内容落临时文件（跨 worker/进程持久化，路径随任务 payload 存储）。"""
    d = _temp_dir(task_id)
    os.makedirs(d, exist_ok=True)
    path = os.path.join(d, name)
    with open(path, "wb") as f:
        f.write(raw)
    return path


def _load_upload(spec: Optional[dict]) -> Optional[Tuple[str, bytes]]:
    """从 payload 的 {name,path} 恢复上传文件 (name, bytes)。"""
    if not spec:
        return None
    with open(spec["path"], "rb") as f:
        raw = f.read()
    return (spec.get("name", ""), raw)


def _cleanup_temp(task_id: str) -> None:
    shutil.rmtree(_temp_dir(task_id), ignore_errors=True)


def create_app() -> FastAPI:
    setup_logging()
    # 全局串行队列（lifespan 启动 worker；上传请求经 enqueue 入队）
    queue: Optional[TaskQueue] = None

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        nonlocal queue
        queue = create_task_queue(settings.task_store, settings.pg_dsn, run_main_task)
        # try/finally：即使运行期抛异常，退出时也保证 stop worker、释放锁
        try:
            queue.start()
            yield
        finally:
            queue.stop()

    app = FastAPI(
        title="Knowledge Graph File Import Service",
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
        # 实体/边全量返回（前端选择入库用）；仍保持自洽：只返回端点都在实体集内的边，
        # 否则前端图谱渲染会出现引用缺失节点的悬空边。errors/warnings 保留截断控制体积。
        entities = [asdict(e) for e in result.entities]
        ent_ids = {e["id"] for e in entities}
        edges = [
            asdict(e)
            for e in result.edges
            if e.source in ent_ids and e.target in ent_ids
        ]
        return {
            "success": True,
            "data": {
                "entityCount": len(result.entities),
                "edgeCount": len(result.edges),
                "skipped": result.skipped,
                "entities": entities,
                "edges": edges,
                "errors": result.errors[:limit],
                "warnings": result.warnings[:limit],
            },
        }

    app.add_api_route("/api/v1/import/preview", preview, methods=["POST"])

    # ── 导入（主任务 + 子任务流水线）───────────────────

    # 子任务 A：解析实体和边（文件 → ParsedGraph，不写库）
    def subtask_parse(ctx, p):
        store = ctx["store"]
        task_id = ctx["task_id"]
        store.set_stage(task_id, "parsing")
        cfg = m.parse_config(p.get("config_str"))
        subject = p.get("subject") or {}
        authenticated = bool(p.get("authenticated", False))
        tag_data = cfg.tags.model_dump()
        tag_errors = check_tags_permitted(tag_data, subject, authenticated)
        if tag_errors:
            raise PipelineAbort("permission denied: " + "; ".join(tag_errors))
        # 属主 uid 由服务端注入（不可由客户端伪造），供“内部=自己及下级”可见性匹配
        tag_data["ownerUid"] = str(subject.get("uid", ""))
        cfg.tags = m.TagConfig(**tag_data)
        entities = _load_upload(p.get("entities"))
        edges = _load_upload(p.get("edges"))
        tables, twarn = _parse_uploaded(entities, edges, cfg, p.get("template_id"))
        graph = map_tables(tables, cfg)
        graph.warnings = twarn + graph.warnings
        result = validate(graph, cfg)
        # 用户勾选排除：未选中的实体及其关联边不写库（边跟随端点）
        excl = set(cfg.excludeEntityIds)
        if excl:
            result.entities = [e for e in result.entities if e.id not in excl]
            kept_ids = {e.id for e in result.entities}
            result.edges = [
                e
                for e in result.edges
                if e.source in kept_ids and e.target in kept_ids
            ]
        store.set_entity_ids(task_id, [e.id for e in result.entities])
        if result.errors:
            raise PipelineAbort(
                message="; ".join(result.errors[:5]),
                errors=result.errors,
                skipped=result.skipped,
                warnings=result.warnings,
            )
        # A 完成：实体+边作为入参直接传给下一个子任务（B）
        return {"graph": result, "cfg": cfg}

    # 子任务 B：把实体和边在全库计算亲密度，并写库
    def subtask_compute_intimacy(ctx, p):
        store = ctx["store"]
        task_id = ctx["task_id"]
        store.set_stage(task_id, "writing")
        graph = p["graph"]
        cfg = p["cfg"]
        tags = cfg.tags.model_dump()
        subject_raw = p.get("subject_raw", "")
        base = settings.intimacy_base_url or settings.ingestion_base_url
        client = IngestionClient(base)
        # B 核心：在全库计算亲密度（graph-ingestion 只读接口，v2 配置驱动），结果随边写入 props
        if settings.intimacy_mode != "off" and graph.edges:
            intimacies, _stats = client.compute_intimacy(graph.edges)
            for e in graph.edges:
                if e.id in intimacies:
                    e.props["intimacy"] = intimacies[e.id]
        imp_n, skip_n, err_n = client.ingest_nodes(
            graph.entities, tags, chunk=settings.write_chunk, subject=subject_raw
        )
        imp_l, skip_l, err_l = client.ingest_links(
            graph.edges, tags, chunk=settings.write_chunk, subject=subject_raw
        )
        return {
            "imported": imp_n + imp_l,
            # skipped 需包含 A 阶段 validate 跳过的行（如悬空边）+ 写库跳过的
            "skipped": graph.skipped + skip_n + skip_l,
            "errors": err_n + err_l,
        }

    # 注册子任务（未来新增子任务/调整顺序只需改注册表与 DEFAULT_STEPS）
    register_subtask(
        SubtaskSpec(
            name="parse",
            description="解析实体和边（文件 → ParsedGraph）",
            inputs=[
                "entities",
                "edges",
                "config_str",
                "template_id",
                "subject_raw",
                "subject",
                "authenticated",
            ],
            fn=subtask_parse,
        )
    )
    register_subtask(
        SubtaskSpec(
            name="compute_intimacy",
            description="在全库计算亲密度并写库",
            inputs=["graph", "cfg", "subject_raw"],
            fn=subtask_compute_intimacy,
        )
    )

    # 主任务执行器：从队列取出后，串行执行主任务的子任务流水线
    def run_main_task(task_id: str) -> None:
        task = store.get(task_id)
        if task is None:
            return
        ctx = {"store": store, "settings": settings, "task_id": task_id}
        payload = dict(task.payload)
        steps = list(task.steps) or list(DEFAULT_STEPS)

        def on_step(name: str, status: str, detail: str = "") -> None:
            if status == "running":
                store.set_current_step(task_id, name)
            else:
                store.update_subtask(task_id, name, status, detail)

        try:
            final = run_pipeline(steps, ctx, payload, on_step=on_step)
            store.finish(
                task_id,
                final.get("imported", 0),
                final.get("skipped", 0),
                final.get("warnings", []),
                final.get("errors", []),
            )
        except PipelineAbort as e:
            # 业务性中止（权限/校验失败）：按失败但可展示的报告 finish
            store.finish(task_id, 0, e.skipped, e.warnings, e.errors)
        except Exception as e:  # noqa: BLE001
            store.fail(task_id, str(e))
        finally:
            _cleanup_temp(task_id)

    async def import_files(
        request: Request,
        file: Optional[UploadFile] = File(None),
        config: Optional[str] = Form(None),
        template_id: Optional[str] = Form(None),
    ) -> dict:
        ent = await _read_upload(file)
        if ent is None:
            raise HTTPException(status_code=400, detail="require a file")
        subject_raw = request.headers.get("X-User-Context", "")
        subject, authenticated = subject_from_request(request)
        # 创建主任务（含子任务流水线步骤）→ 入全局串行队列
        task = store.create(
            filename=ent[0],
            owner=str(subject.get("username", "")),
            owner_uid=str(subject.get("uid", "")),
            tenant_id=str(subject.get("tenantId", "default")),
            steps=list(DEFAULT_STEPS),
        )
        ent_path = _save_temp(task.id, "entities", ent[1])
        payload = {
            "entities": {"name": ent[0], "path": ent_path},
            "edges": None,
            "config_str": config,
            "template_id": template_id,
            "subject_raw": subject_raw,
            "subject": dict(subject),
            "authenticated": authenticated,
        }
        store.set_payload(task.id, payload)
        queue.enqueue(task)
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
