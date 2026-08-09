"""端到端集成测试：上传文件 → 主任务入队 → A 解析 → B 全库计算亲密度 → 写库。

使用 TestClient（触发 lifespan 启动全局串行队列 worker）+ monkeypatch 替换
IngestionClient（避免依赖跨线程 mock），验证：
1. 主任务 A(parse) → B(compute_intimacy) 子任务进度与串行执行；
2. B 子任务把全库计算的亲密度写入边 props 后随写库；
3. 写库失败 → 主任务 failed 且错误上报。
"""

import io
import time

from fastapi.testclient import TestClient

from app.main import app, store

# 跨线程收集：B 子任务写库时收到的边（含 intimacy）
COLLECTED_LINKS = []
FAIL_NODES = False


class _FakeIngestionClient:
    """模拟 graph-ingestion：compute_intimacy 返回固定亲密度，ingest 记录入参。"""

    def __init__(self, base_url, timeout=60.0):
        self.base_url = base_url

    def ingest_nodes(self, nodes, tags, chunk=500, subject=""):
        if FAIL_NODES:
            return (0, len(nodes), ["/api/v1/ingest/nodes HTTP 500: boom"])
        return (len(nodes), 0, [])

    def ingest_links(self, links, tags, chunk=500, subject=""):
        COLLECTED_LINKS.extend(links)
        return (len(links), 0, [])

    def compute_intimacy(self, links):
        # 全库计算：每条边返回 0.5（中性）
        return ({l.id: 0.5 for l in links}, {})


def _wait_task(task_id):
    status = ""
    for _ in range(200):
        task = store.get(task_id)
        if task and task.status in ("success", "failed"):
            return task, task.status
        time.sleep(0.05)
    return store.get(task_id), status


def _upload(client):
    csv = io.BytesIO(b"id,source,target,linkType,label\ne1,p1,p2,CALL,call1\n")
    # 单文件 CSV 只有边表：dangling=auto-create 让端点自动建实体，边才保留
    cfg = '{"dangling":"auto-create","danglingNodeType":"phone"}'
    resp = client.post(
        "/api/v1/import/files",
        files={"file": ("call.csv", csv, "text/csv")},
        data={"config": cfg},
    )
    assert resp.status_code == 200
    return resp.json()["data"]["taskId"]


def test_upload_full_pipeline_with_intimacy(monkeypatch):
    monkeypatch.setattr("app.main.IngestionClient", _FakeIngestionClient)
    COLLECTED_LINKS.clear()

    with TestClient(app) as client:
        task_id = _upload(client)

        # 主任务完成（worker 串行执行 A→B）
        task, status = _wait_task(task_id)
        assert status == "success", (task.errors if task else "task missing")

        # A(parse) → B(compute_intimacy) 子任务进度均 success
        assert [s["name"] for s in task.subtasks] == ["parse", "compute_intimacy"]
        assert all(s["status"] == "success" for s in task.subtasks)
        assert task.steps == ["parse", "compute_intimacy"]
        assert task.current_step == "compute_intimacy"

    # B 子任务把亲密度写进边 props 后随写库提交
    assert len(COLLECTED_LINKS) == 1
    assert COLLECTED_LINKS[0].props.get("intimacy") == 0.5


def test_upload_flow_failure_marks_task_failed(monkeypatch):
    monkeypatch.setattr("app.main.IngestionClient", _FakeIngestionClient)
    global FAIL_NODES
    FAIL_NODES = True
    try:
        with TestClient(app) as client:
            task_id = _upload(client)
            task, status = _wait_task(task_id)
            assert status == "failed"
            # parse 成功；compute_intimacy 阶段写库错误 → 任务 failed + error_count
            assert task.subtasks[0]["name"] == "parse"
            assert task.subtasks[0]["status"] == "success"
            assert task.subtasks[1]["name"] == "compute_intimacy"
            assert task.error_count >= 1
            assert any("ingest" in e for e in task.errors)
    finally:
        FAIL_NODES = False
