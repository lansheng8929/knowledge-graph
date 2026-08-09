# 亲密度计算 + 主任务/子任务流水线计划

> 目标：上传文件 → 全局任务队列新增一个**主任务**（含两个**子任务**）。
> A 子任务解析实体和边；完成后直接把实体/边作为入参传给 B 子任务，B 在全库计算亲密度。
> 主任务串行执行（完成一个文件再处理下一个）；未来可自由调整子任务入参与顺序。

## 1. 设计原则（复用现有工具框架，不引入新依赖）

- 基础设施**没有 Redis/Celery/RabbitMQ** broker → 不引入任务队列框架。
- `file-import-service` **不自连 Neo4j**（writer.py 约束："唯一写通道"）→ 亲密度计算复用
  `graph-ingestion` 已建好的 Neo4j driver，通过 HTTP 暴露成只读计算服务。
- 队列持久化复用现有 `PostgresTaskStore`（`import_tasks` 表）；全局串行用 Postgres
  **advisory lock**；Memory 模式用 Python 标准库 `queue.Queue` + 单 worker 线程。

## 2. 架构分层

```
上传文件 (POST /api/v1/import/files)
   │  创建主任务(queued) → 入全局队列
   ▼
worker（advisory lock 保证一次只跑一个主任务）
   ├─ 子任务 A: parse          现有 解析→映射→校验，输出 ParsedGraph(实体+边)
   └─ 子任务 B: compute_intimacy
        ├─ POST graph-ingestion /api/v1/ingest/compute-intimacy   # 只读，算 intimacy
        └─ POST graph-ingestion /api/v1/ingest/{nodes,links}      # 写库（带 intimacy）
下一个主任务 ...
```

- **主任务** = 有序 `steps` 列表 + 当前 step + 子任务进度；steps 可配置（满足"可调整顺序/入参"）。
- **子任务** = `{name, inputs[], run(ctx, payload) -> 增量payload}`，注册表按名查找。

## 3. graph-ingestion 新增接口（只读，不改写入口）

```
POST /api/v1/ingest/compute-intimacy
req:  { "edges": [ { "id": "e1", "source": "a", "target": "b", "linkType": "CALL", "weight": 1 } ] }
resp: { "success": true,
        "data": { "intimacies": { "e1": 0.83 }, "stats": { "e1": { "existing": 2, "batch": 1, "total": 3 } } } }
```

实现：

- 用 `app.state.driver`（lifespan 已建）只读查询每对 `(s,t)` 之间**已存在**的关系数（跨 linkType、双向）。
- `N_total = existing + batch 内同对(s,t) 边数`。
- 默认算法（频次归一化）：`intimacy = 1 - 1/(1 + N_total)`（1 条 → 0.5，越多越接近 1）。
- 支持可选 `weight`（类型权重）加权：`N_weighted = Σ weight` 后归一化。
- **只返回结果，不写库**；`ingest_nodes/ingest_links` 一行不改。

### 算法（可配置）

```python
# mode=count（默认）: intimacy = 1 - 1/(1 + total)
# mode=weighted  :     total = Σ(weight)，再按饱和归一化
```

## 4. file-import-service 改动

### 4.1 新文件 `app/pipeline.py` — 子任务注册表 + 主任务执行器

```python
SUBTASKS: Dict[str, SubtaskSpec] = {}   # parse / compute_intimacy（未来可加 ingest...）

def register_subtask(name, description, inputs, fn): ...

class MainTask:      # 主任务：steps 有序列表
    id, filename, status(queued|running|success|failed),
    steps: List[str], current_step: str, subtasks: List[SubtaskStatus],
    payload_ref: str   # 中间产物（A→B 传递）引用

def run_pipeline(main_task, ctx, payload) -> (result, subtask_progress)
```

### 4.2 新文件 `app/queue.py` — 全局串行队列

- `MemoryTaskQueue`：`queue.Queue` + 单 worker 线程，天然串行（dev 用）。
- `PostgresTaskQueue`：worker 循环 `SELECT ... FOR UPDATE SKIP LOCKED` 抢 queued 主任务，
  `pg_advisory_lock(常量 key)` 保证全局一次一个，执行完 unlock 取下一个。
- 两者统一接口：`enqueue(main_task)` / worker 启动 / `wait_for_healthy`。

### 4.3 改 `app/tasks.py` — ImportTask 扩展

新增字段：`steps: List[str]`、`current_step: str`、`subtasks: List[dict]`
（每步 status/detail）、`queued_at`；summary_dict/to_dict 带上子任务进度。
Postgres 表加列（`steps JSONB`、`current_step TEXT`、`subtasks JSONB`、`queued_at TEXT`）。

### 4.4 改 `app/main.py`

- `import_files`：不再直接 `BackgroundTasks` 跑 `_run_import`，改为
  `create MainTask(steps=["parse","compute_intimacy"]) → queue.enqueue`。
- `_run_import` 拆成两个子任务函数：
  - `parse(ctx, p)`：解析→映射→校验，输出 `{"graph": ParsedGraph, "warnings": [...]}`。
  - `compute_intimacy(ctx, p)`：取 `p["graph"]` → 调 compute-intimacy → 边 props 写入 intimacy
    → ingest 写库 → 输出 `{"imported","skipped","errors"}`。
- `lifespan`：启动 queue worker（按 `TASK_STORE` 选 Memory/Postgres 队列）。
- `get_task`/`list_tasks`：返回主任务 + 子任务进度。

### 4.5 改 `app/config.py`

新增：`intimacy_mode`（off|count|weighted）、`intimacy_base_url`（默认=ingestion_base_url）、
`intimacy_enabled`（未配置/off 时 B 子任务跳过计算，写库不带 intimacy，读取端兜底 0.5）。

### 4.6 改 `app/writer.py`

`IngestionClient` 增加 `compute_intimacy(links)` 方法（httpx 模式，与现有一致）。

## 5. 数据流（payload 传递）

```
main_payload = {
  "entities_file", "edges_file", "config_str", "template_id",
  "subject_raw", "subject", "authenticated",
}
A parse            → payload["graph"], payload["warnings"]
B compute_intimacy → payload["graph"]（边 props 带 intimacy）, payload["imported"/"skipped"/"errors"]
主任务 finish：status=success/failed，子任务进度落库
```

## 6. 部署（docker-compose）

- dev：`import` 服务加 `INTIMACY_MODE=count`（默认即可，`INTIMACY_BASE_URL` 缺省=INGESTION_BASE_URL）。
- prod：`file-import-service` 加 `INTIMACY_MODE=count`；无额外依赖。

## 7. 实施步骤（文件清单）

1. `services/graph-ingestion/app/models.py` — IntimacyEdge / IntimacyRequest / IntimacyResponse
2. `services/graph-ingestion/app/intimacy.py`（新）— compute_intimacy（查全库统计 + 归一化）
3. `services/graph-ingestion/app/main.py` — 注册 `/api/v1/ingest/compute-intimacy`
4. `services/file-import-service/app/pipeline.py`（新）— 子任务注册表 + 主任务执行器
5. `services/file-import-service/app/queue.py`（新）— 全局串行队列（Memory + Postgres）
6. `services/file-import-service/app/tasks.py` — ImportTask 扩展主任务/子任务字段（含建表）
7. `services/file-import-service/app/writer.py` — IngestionClient.compute_intimacy
8. `services/file-import-service/app/main.py` — 上传入队 + worker + 任务查询
9. `services/file-import-service/app/config.py` — 亲密度配置
10. 测试：`services/graph-ingestion/tests/test_intimacy.py`（新）、
    `services/file-import-service/tests/test_pipeline.py`（新）、`test_queue.py`（新）

## 8. 兼容性

- `INTIMACY_MODE=off`（或未配置 Neo4j）：B 子任务跳过计算 → 行为与现状一致（无 intimacy，
  graph-query 读取兜底 0.5）。
- 任务接口返回结构向后兼容：原字段不变，新增 `steps/current_step/subtasks` 可选字段。
- graph-ingestion 原 ingest 端点不变。

---

# 9. 亲密度 v2：多维计算引擎 + 可更新

> **背景（设计决策，2026-08-07）**：v1 按"节点对边数"计算（`1-1/(1+total)`），导致：
>
> 1. 同一对节点的所有边**亲密度相同**（无法区分单条强弱）；
> 2. **数量被双重计算**——亲密度里算了边数，前端物理引擎多边叠加又算一次边数。
>
> **v2 修正**：亲密度只表达**单条边的质量**（不含数量）；"边越多越近"交给前端物理引擎的
> 多边叠加负责。同时支持**多维度**计算与**可更新**（重算已入库边）。

## 9.1 核心原则

```
intimacy = f(单条边的质量)          # 不含边数；同对边可不同
节点距离 = 物理引擎叠加(边数 × 各边 intimacy)   # 数量交给前端
```

## 9.2 维度设计（当前可设计的全部维度）

| 维度             | 语义                   | 计算方式                                            | 输入来源               |
| ---------------- | ---------------------- | --------------------------------------------------- | ---------------------- |
| `linkTypeWeight` | 关系类型基础权重       | `score = weights[linkType]`（缺省 `defaultWeight`） | 边 linkType            |
| `businessMetric` | 业务指标归一化         | `score = clamp(value/max, 0, 1)`；多字段取均值      | 边 props 字段          |
| `timeDecay`      | 时间衰减（越新越亲）   | `score = 0.5^(age_days/halfLifeDays)`               | 边 time 字段           |
| `frequency`      | 频次热度（**默认关**） | `score = 1 - 1/(1 + 该对边数)`                      | 对级别统计（可选开启） |

> `frequency` 维度默认关闭（v1 教训：与物理引擎叠加重复）。如需"热度"语义可手动开启。

## 9.3 组合策略（可配置）

```
combine=product      : intimacy = Π score_i        （默认；任一维低则整体低）
combine=weighted_sum : intimacy = Σ w_i · score_i  （各维独立贡献）
```

## 9.4 配置模型（JSON，`INTIMACY_CONFIG` 环境变量，可热更新）

```jsonc
{
  "version": 2,
  "combine": "product",
  "dimensions": {
    "linkTypeWeight": {
      "enabled": true,
      "weights": { "CALL": 0.6, "TRANSFER": 0.9, "OWNS": 0.7 },
      "defaultWeight": 0.5,
    },
    "businessMetric": {
      "enabled": true,
      "fields": [{ "field": "amount", "min": 0, "max": 100000 }],
    },
    "timeDecay": {
      "enabled": true,
      "field": "time",
      "halfLifeDays": 365,
      "refTime": "now",
    },
    "frequency": { "enabled": false },
  },
}
```

## 9.5 可更新（重算）

| 场景                | 途径                                                      |
| ------------------- | --------------------------------------------------------- |
| 上传新数据          | 写库前对新边算 intimacy（MERGE 覆盖已有边，天然更新）     |
| 时间流逝 / 配置变更 | `POST /api/v1/ingest/recompute-intimacy` 重算并更新库中边 |

```
POST /api/v1/ingest/recompute-intimacy
req: { "scope": "all" | "linkTypes" | "edgeIds" | "pairs",
       "linkTypes": [...], "edgeIds": [...], "pairs": [["a","b"], ...] }
resp: { "success": true, "data": { "updated": N } }
```

- 遍历选中的边，按**当前配置**重算 `r.intimacy` 并 `SET` 更新。
- 幂等、可重复触发；空 scope 时全量重算。

## 9.6 接口变更

```
POST /api/v1/ingest/compute-intimacy     # 只读：入参边列表（含 props/time），按当前配置算单条质量
POST /api/v1/ingest/recompute-intimacy   # 可更新：重算并更新库中边
```

`IntimacyEdge` 入参扩展：`props: dict`（业务指标/时间取值）、`time: str`。

## 9.7 文件清单（v2 增量）

1. `graph-ingestion/app/intimacy.py` — 重构为配置驱动引擎（维度 score + 组合 + recompute）
2. `graph-ingestion/app/models.py` — `IntimacyEdge` 扩展 props/time；新增 `RecomputeIntimacyRequest`
3. `graph-ingestion/app/config.py` — `INTIMACY_CONFIG`（JSON）
4. `graph-ingestion/app/main.py` — 更新 compute-intimacy；新增 recompute-intimacy 路由
5. `file-import-service/app/writer.py` — `compute_intimacy` 传 props/time
6. `file-import-service/app/main.py` — B 子任务把边 props/time 传给计算接口
7. 测试：更新 `test_intimacy.py`（多维/组合/重算）
