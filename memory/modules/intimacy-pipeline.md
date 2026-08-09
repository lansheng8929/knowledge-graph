# 亲密度计算 + 主任务/子任务流水线

## 理解 (2026-08-07)

- **上传 = 主任务**：`POST /api/v1/import/files` 创建主任务（status=`queued`，steps=[parse, compute_intimacy]）→ 入全局串行队列。
- **主任务之间串行**：`app/queue.py`；Memory=单 worker 线程，Postgres=advisory lock + `FOR UPDATE SKIP LOCKED`，一次只跑一个主任务。
  - ⚠️ **坑**：Postgres 队列 `acquire()` 抢任务后必须 `conn.commit()`（psycopg3 不自动提交）——否则 `FOR UPDATE` 行锁未释放，handler 用其它连接 UPDATE 同一行会被自己的行锁卡死（自死锁）。advisory lock 是会话级，commit 不影响；`_run` 的 `acquire()` 已包 try/except 防 worker 崩溃。
- **子任务可组合**：`app/pipeline.py` 注册表；每个子任务 `{name, inputs白名单, fn(ctx, sub_input)->增量payload}`，A 的输出 merge 回 payload 作为 B 的入参；改步骤顺序/入参只动注册表与 DEFAULT_STEPS。
- **A=parse**：解析→映射→校验，输出 ParsedGraph（实体+边），不写库。
- **B=compute_intimacy**：调 graph-ingestion `compute-intimacy`（只读，v2 配置驱动；frequency 维度默认关 → 默认不查库）→ 把 intimacy 写入边 `props["intimacy"]` → 随 `ingest_links` 写库。B 完成=主任务完成（数据已带亲密度入库）。
- **亲密度算法 v2**（graph-ingestion `app/intimacy.py`，配置驱动）：亲密度 = **单条边质量**（不含边数，避免与前端物理引擎多边叠加双重计算数量）。维度：`linkTypeWeight`（类型权重，weights\[linkType\] > edge.weight > defaultWeight 0.5）/ `businessMetric`（props 字段 clamp(v/max,0,1)，多字段均值）/ `timeDecay`（0.5^(age_days/halfLifeDays)）/ `frequency`（1-1/(1+count)，默认关，启用才查全库）。组合：product（默认，维度关闭=1.0 中性）\| weighted_sum。配置：`INTIMACY_CONFIG` JSON。
- **亲密度可更新**：`POST /api/v1/ingest/recompute-intimacy`（scope=all\|linkTypes\|edgeIds\|pairs）按当前配置重算 `SET r.intimacy` 更新库中边；上传新边写库前计算（MERGE 覆盖天然更新）。
- **写入位置**：B 子任务把 intimacy 塞进 `ParsedEdge.props["intimacy"]` → ingest_links → graph-ingestion `SET r += props` 展开为 Neo4j 关系顶层属性 `r.intimacy` → 查询端 `rel.get("intimacy", 0.5)`。
- **临时文件**：上传内容落 `$TMPDIR/kg-import-{task_id}/`，路径存任务 payload（跨 worker/进程），任务结束清理。
- **任务模型**：`ImportTask` 新增 `steps/current_step/subtasks/queued_at/payload`；Postgres `import_tasks` 表加列 + `_ensure_columns` 幂等迁移；`to_dict` 不回传 payload。
- **INTIMACY_MODE=off** 时 B 跳过计算，行为与旧版一致（读取端兜底 0.5）。

## 文件关联

- `services/graph-ingestion/app/intimacy.py` - 亲密度计算（只读，driver 注入）
- `services/graph-ingestion/app/main.py` - `/api/v1/ingest/compute-intimacy` + `/api/v1/ingest/recompute-intimacy`
- `services/file-import-service/app/pipeline.py` - 子任务注册表 + run_pipeline
- `services/file-import-service/app/queue.py` - 全局串行队列（Memory/Postgres advisory lock）
- `services/file-import-service/app/tasks.py` - ImportTask 主任务/子任务字段 + 迁移
- `services/file-import-service/app/main.py` - 上传入队 + worker + 子任务定义
- `services/file-import-service/app/writer.py` - IngestionClient.compute_intimacy
- `docs/intimacy-pipeline-plan.md` - 设计计划
- 测试：`graph-ingestion/tests/test_intimacy.py`、`file-import-service/tests/test_pipeline.py`、`test_queue.py`、`test_import_flow.py`
