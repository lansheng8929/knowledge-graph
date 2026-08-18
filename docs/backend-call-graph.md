# 知识图谱后端「函数级调用关系图」

> 范围：6 个 Python 服务（services/*/app 全部 .py，源码逐函数核对，无臆造）；不含 tests/、egg-info、__pycache__。
> 符号：`route_x → fn_y` 表示调用（缩进=层级）；`[HTTP→svc]`=对其它服务的 HTTP 客户端调用；shared 包位于 `shared/service-common`、`shared/pep-client`、`shared/audit`。

## 1. services/auth-service — 登录 / JWT 签发 / 用户 / 组织层级 / L1 网关

### 1.1 入口与路由（app/main.py `create_app()`）
| 方法 | 路径 | 处理函数 | 说明 |
|---|---|---|---|
| GET | /health, /healthz | health | 健康检查 |
| POST | /api/v1/auth/login | login | 密码认证 + 签发 JWT |
| GET | /api/v1/auth/users | list_users | 用户列表（admin） |
| POST | /api/v1/auth/users | create_user | 建用户（admin） |
| GET | /api/v1/auth/userinfo | userinfo | 当前用户实时属性 |
| GET/POST | /_authz | authz | 网关 auth_request，返回 X-Subject-Context |

- lifespan：无；中间件：仅 CORSMiddleware（settings.cors_origins 非空时）。
- 模块级 `L1_RULES`：`/api/v1/ingest/`→{privileged}、`/api/v1/graph/expand`→{analyst}（最长前缀匹配）。
- 启动 bootstrap：`create_user_store` 建 store；若 `bootstrap_admin_password` 且无 admin → `hash_password` + `store.upsert` 注入初始管理员。

### 1.2 函数关系（调用链）
```
create_app()                        # 装配 + 路由注册
├─ _bearer_token(request)           # 取 Bearer token，无则 401
├─ _subject_from_token(token)       # verify(token) → service_common.subject_from_payload
├─ _require_admin(subject)          # roles 含 admin 否则 403
├─ _l1_check(subject, path)         # L1_RULES 前缀匹配，无交集 → 403
├─ login(req) → store.get → verify_password → compute_sub_uids(store.list, uid)
│             → issue(subject, user, secret, ttl) → store._public(user)
├─ list_users → _bearer_token → _subject_from_token → _require_admin
│             → store.list → [store._public]
├─ create_user → 同上 → store.get(判重409) → hash_password → store.upsert
├─ userinfo   → _bearer_token → verify → _subject_from_token → store.get
│             → compute_sub_uids → 返回实时属性
└─ authz      → _bearer_token → _subject_from_token → _l1_check(X-Original-URI)
              → Response(200, headers={"X-Subject-Context": json})
```

- `jwt.py`：issue/sign/verify 全部 re-export 自 `service_common.jwt`（HS256 纯标准库）。
- `security.py`：`hash_password(pw, iterations=120000)` / `verify_password(pw, stored)`（PBKDF2-HMAC-SHA256，`$` 分段，hmac.compare_digest）。
- `org.py`：`compute_sub_uids(users, uid)` 按 managerUid 树 DFS 求全部间接下级；`org_path(user, default)`。
- `store.py`：接口 `UserStore`(get/list/upsert/delete/_public) → `MemoryUserStore`(dict) 与 `PostgresUserStore`(表 auth_users，`_connect_with_retry` 线性退避、`_row_to_user` 显式列序映射)；工厂 `create_user_store(kind, dsn)`。
- `users.py`：常量 `SEED_USERS`（4 个种子用户属性，无密码）；`seed_users.py main()` 幂等插入（`hash_password`，密码由 env 注入）。

### 1.3 模块间依赖
```
app/main.py ─→ config, jwt, org, security, store
app/seed_users.py ─→ config, security, store, users
app/jwt.py ─→ service_common.jwt          app/main.py ─→ service_common.subject.subject_from_payload
对外 HTTP：无（纯 IDP）｜ Postgres：psycopg（AUTH_DB_DSN）
```

### 1.4 关键数据流
① 登录：`POST /login → login() → store.get(username)`；无用户/disabled/`verify_password` 失败 → 401/403；成功 → `compute_sub_uids(store.list(), uid)` 注入 subUids → `issue()` 打包 sub/uid/tenantId/clearance/roles/teams/orgPath/managerUid/subUids/iat/exp 签名 → 返回 `{token, token_type, expires_in, user}`。
② 网关校验：nginx auth_request → `_authz → _bearer_token → verify → subject_from_payload → _l1_check(原始URI)`（命中 /api/v1/ingest/ 且无 privileged 即 403）→ 200 + X-Subject-Context JSON 回传，网关注入上游 X-User-Context。

## 2. services/graph-query-service — 图谱查询 / 流式 NDJSON / L3 / L4 / 规则校验客户端

### 2.1 入口与路由（app/main.py）
| 方法 | 路径 | 处理函数 |
|---|---|---|
| GET | /health /healthz /metrics | health / metrics.metrics_response |
| POST | /api/v1/graph/{init,search,expand,analyze}（旧 /api/graph/* 同 handler，enable_legacy_routes 开关） | init_graph / search_nodes / expand_graph / analyze_node |
| POST | /api/v1/graph/{init,expand}/stream | init_graph_stream / expand_graph_stream |

- lifespan：`GraphDatabase.driver(...)` 挂 app.state.driver，预热 + 按 `_INDEX_SPECS` 建 9 组索引（失败不阻断，/healthz 暴露）。
- 中间件：CORSMiddleware；`MetricsMiddleware`（REQUEST_TOTAL/REQUEST_LATENCY）；OTel `init_tracing + instrument_fastapi`（可选）。
- 异常处理器 `_neo4j_error_handler`：AuthError/ServiceUnavailable→503、ClientError→400、其它→500。

### 2.2 函数关系（调用链）
```
main.create_app()
├─ _l2_check(subject, action)          # get_pep()→pep.check(resource,action)；deny→audit+403
├─ init_graph / search_nodes / analyze_node → subject_from_request → _l2_check → q.query_*
├─ expand_graph → _l2_check("expand")
│   ├─ ruleId 非空且非 __custom__ → _rule_client.validate(ruleId, conditions)
│   │   （RuleServiceUnavailable → 打印并回退本地 validator）
│   └─ q.query_expand(driver, req, subject) → 成功 → observability.audit(allow)
├─ init_graph_stream → StreamingResponse(_ndjson(q.query_init_stream(...)))
├─ expand_graph_stream → 同 expand 规则校验 → gen(): for row in q.query_expand_stream: yield
│   finally: audit(allow, reason="stream")
└─ _ndjson(gen)                        # 每行 json.dumps + "\n"

queries.py
├─ query_init(ids)        → l3_conditions → node_to_obj → l3_visible；节点间边查询
├─ query_search(q,limit)  → l3_conditions → node_to_obj → l3_visible
├─ query_expand(req)      → parse_conditions → normalize_conditions
│   → _build_match_clause / _build_where_clause(l3_conditions + _OPERATOR_MAP)
│   → UNION ALL 合并 → mask_sensitive → get_neighbor_summary → l3_visible
├─ query_analyze(req)     # call_circle: MATCH (n)-[r:CALLED]-(other:phone) 按 count 聚合 TOP20
├─ query_init_stream(ids)→ l3_conditions；节点/边双游标交错 yield meta/node/link/done
├─ query_expand_stream(req) → 同 query_expand 组装 → yield meta → 逐条 _stream_link + 节点 → done
├─ node_to_obj(record)   → mask_sensitive → get_neighbor_summary
├─ get_neighbor_summary(driver, node_id)   # 出入方向邻居类型/关系/数量统计
└─ _stream_link(sid,tid,rel_type,rel)      # 边 → 流式 link chunk data

pep.py        # subject_from_request（service_common.subject，default=DEFAULT_SUBJECT, secret=auth_secret）
              # l3_conditions(alias)：租户+public/internal/private/secret 分层的 Cypher where+params
              # l3_visible：内存投影裁剪（双保险）；get_pep() 懒加载 PepClient(opa_url)（enable_pep 才启用）
masking.py    # mask_sensitive(node_type, data, subject)：clearance>=密级→原样；否则 phone label 掩码 138****1234
validator.py  # parse_conditions / validate_condition / normalize_conditions / _reject
              # 白名单：7 节点类型/8 关系类型/8 操作符/in|out（lenient 跳过，strict 抛 400）
rule_client.py# RuleServiceClient.validate → _post → POST {base}/api/v1/rules/validate（urllib，3s 超时）
              # 网络/解析异常 → RuleServiceUnavailable
observability.py # audit() → audit_sink.create_sink(audit_sink,file,dsn).emit(record)；异常回退 audit logger
```

### 2.3 模块间依赖
```
main ─→ config, metrics, models, queries, observability, pep, rule_client
queries ─→ models, masking, pep(l3_conditions/l3_visible), validator
pep ─→ config, service_common.subject          observability ─→ audit_sink（懒加载）
对外 HTTP：rule_client → graph-rule-service POST /api/v1/rules/validate；pep_client → OPA :8181
数据源：Neo4j bolt（driver 由 lifespan 注入 app.state）
```

### 2.4 关键数据流
① 流式拓出：`POST /expand/stream → expand_graph_stream → _l2_check("expand")` → `RuleServiceClient.validate(ruleId, conditions)`（规则服务值级白名单；不可达回退本地 `normalize_conditions`）→ `query_expand_stream`：`parse_conditions → normalize_conditions → _build_match_clause + _build_where_clause`（含 `l3_conditions(target)` 数据级过滤）→ 组装 UNION ALL Cypher → 先 `yield meta(total)` → 逐条 `_stream_link` 边 + 节点（`mask_sensitive` L4 脱敏 → `get_neighbor_summary` → `l3_visible` L3 双保险）→ `yield done` → 外层 `_ndjson` 逐行序列化 → StreamingResponse；`finally` 写审计。
② 流式 init：`query_init_stream`：`l3_conditions(n)` 过滤 → 节点游标 `n.id IN $ids` 与边游标 `(a)-[r]->(b)` 并行交错 yield（node/link 同步出）→ done。
③ 非流式 init/search/expand 共享同一管线：`query_* → l3_conditions(Cypher 层) → node_to_obj/mask_sensitive(L4) → l3_visible(内存层)`。

## 3. services/graph-rule-service — 规则 CRUD / 发布 / 值级白名单校验 / L2 PEP

### 3.1 入口与路由（app/main.py）
| 方法 | 路径 | 处理函数 |
|---|---|---|
| GET | /health /healthz /metrics | health / metrics_response |
| POST | /api/v1/rules/validate（须先于 /{rule_id} 注册） | validate_conditions_endpoint |
| GET/POST | /api/v1/rules | list_rules / create_rule |
| GET/PUT/DELETE | /api/v1/rules/{rule_id} | get_rule / update_rule / delete_rule |
| POST | /api/v1/rules/{rule_id}/publish | publish_rule（→ store.set_status(PUBLISHED)） |

- lifespan：`store.ensure_ready()`（PG 建表，失败不阻断）；中间件：CORSMiddleware、MetricsMiddleware、OTel。

### 3.2 函数关系（调用链）
```
create_app()
├─ _l2_check(subject, action, request)    # get_pep()→pep.check(action="rule_validate")；deny→audit+403
├─ validate_conditions_endpoint → subject_from_request → _l2_check
│   → parse_conditions（JSONDecodeError→valid=false）
│   → 无内联 rule 时 store.get(ruleId)（无 → "rule not found"）
│   → validator.validate_conditions(conds, rule) → audit(allow/deny)
├─ list_rules → store.list     ｜  create_rule → store.create
├─ get_rule / update_rule / delete_rule → store.get/update/delete（无则 404）
└─ publish_rule → store.set_status(rule_id, RuleStatus.PUBLISHED)

store.py
├─ RuleStore(ABC): ensure_ready/list/get/create/update/set_status/delete
├─ InMemoryRuleStore          # _next_id() 自增 rule-N，内存 dict
└─ PostgresRuleStore          # 表 rules（definition JSONB）；_connect→psycopg；
    └─ _row_to_rule 解析 allowed* 数组        create_store(backend) 工厂

validator.py
├─ parse_conditions(raw)                    # JSON→list[dict]，非法抛 JSONDecodeError
├─ validate_conditions(conds, rule, strict=False) → ValidationResult(valid=not errors)
│   # 标识符 [A-Za-z0-9_] 防 Cypher 注入；targetType/relationType/property ∈ rule.allowed*；
│   # operator ∈ allowedOperators or 默认 8 个；lenient 记 error，strict 抛 ConditionValidationError
└─ ConditionValidationError / ValidationResult（normalized + errors）
```

### 3.3 模块间依赖
```
main ─→ config, metrics, models, observability, pep, store, validator
store ─→ config, models        ｜  validator ─→ models
pep ─→ config, service_common.subject        observability ─→ audit_sink（懒加载）
对外 HTTP：无下游服务调用；pep_client → OPA（可选）；Postgres：psycopg（PG_DSN）
```

### 3.4 关键数据流
① 值级白名单校验（供 query-service 调用）：`POST /rules/validate → validate_conditions_endpoint`：`parse_conditions` → 无内联 rule 则 `store.get(ruleId)` → `validate_conditions(conds, rule)`：逐条件校验 targetType/relationType/direction/filters 是否落在规则 allowed* 白名单 → `{valid, normalized, errors}` 信封返回，同时 `audit(validate, allow/deny)`。
② 规则生命周期：`POST /rules → store.create`（status=DRAFT）→ `POST /rules/{id}/publish → store.set_status(PUBLISHED)`；`PUT /rules/{id} → store.update`（version+1）。

## 4. services/graph-ingestion — 数据写入 / 强制打标 / 亲密度 v2 / 重算

### 4.1 入口与路由（app/main.py）
| 方法 | 路径 | 处理函数 |
|---|---|---|
| GET | /health /healthz | health |
| POST | /api/v1/ingest/nodes | ingest_nodes |
| POST | /api/v1/ingest/links | ingest_links |
| POST | /api/v1/ingest/compute-intimacy | compute_intimacy |
| POST | /api/v1/ingest/recompute-intimacy | recompute_intimacy |

- lifespan：driver 建连 + 预热；中间件：仅 CORSMiddleware。

### 4.2 函数关系（调用链）
```
create_app()
├─ _node_tags(n) / _link_tags(l)          # 抽 5 个强制标签字段
├─ ingest_nodes(req) → validate_tags(_node_tags(n))（TagValidationError→400）
│   → _IDENTIFIER_RE.match(nodeType) → session.run("MERGE (n:{type} {id}) SET n += $props")
├─ ingest_links(req) → validate_tags → MATCH(s)/MATCH(t)/MERGE (s)-[r:{type} {id}]->(t) SET r += props
├─ compute_intimacy(req) → intimacy_mod.compute_intimacy(driver, req.edges, intimacy_cfg)
└─ recompute_intimacy(req) → intimacy_mod.recompute_intimacy(driver, intimacy_cfg, req)

intimacy.py（v2 多维引擎，配置 INTIMACY_CONFIG 驱动）
├─ load_config(raw)                        # 空/非法 → DEFAULT_INTIMACY_CONFIG（combine=product）
├─ _score_link_type(edge,cfg)              # weights[linkType] > edge.weight > defaultWeight，clamp 0~1
├─ _score_business(edge,cfg)               # (v-min)/(max-min) 归一化，多字段取均值；关→1.0
├─ _score_time(edge,cfg,now)               # 0.5^(age_days/halfLifeDays) 时间衰减
├─ _score_frequency(count)                 # 1 - 1/(1+count)；默认关闭
├─ _combine(scores,cfg)                    # product（默认，相乘）| weighted_sum（均值）
├─ _score_edges(edges,cfg,freq_existing,freq_batch)   # 纯计算 → {edge_id: 0~1, stats}
├─ compute_intimacy(driver,edges,cfg)      # frequency 开启才查库：_existing_counts(UNWIND 全库统计)
│   → _batch_counts(批内同对计数) → _score_edges      # 只读不写库
├─ _relation_view(rec)                     # 库中边 → IntimacyEdge（剔除公共字段=业务 props）
├─ _scope_query(req)                       # all | linkTypes | edgeIds | pairs 四种 scope
└─ recompute_intimacy(driver,cfg,req)      # _scope_query → _relation_view → _score_edges → SET r.intimacy

tags.py
├─ validate_tags(tags)                     # 强制 4 标签 + classification int∈[0,3] + visibility 枚举；违规抛 TagValidationError
└─ merge_default_tags(data)                # backfill DEFAULT_TAGS（tenantId/classification/owner/visibility）
```

### 4.3 模块间依赖
```
main ─→ config, intimacy, models, tags       intimacy ─→ models
不引用 service_common / pep_client / audit_sink；无对外 HTTP；数据源仅 Neo4j（唯一写通道）
```

### 4.4 关键数据流
① 批量写节点：`POST /ingest/nodes → ingest_nodes`：每节点 `_node_tags` 抽标签 → `validate_tags`（缺标/非法 → 400 拒写）→ nodeType 标识符校验 → `MERGE (n:{nodeType} {id}) SET n += {label, icon, tenantId, classification, owner, visibility, ownerUid, **props}`；关系 `MATCH(s)/MATCH(t)/MERGE (s)-[r:{linkType} {id}]->(t) SET r += props`（MERGE 幂等）。
② 亲密度 v2（只读）：`POST /compute-intimacy → compute_intimacy → _score_edges`：每边 `_score_link_type × _score_business × _score_time`（默认 product 组合；frequency 开启时叠加 `_existing_counts + _batch_counts` 的 `_score_frequency`）→ 返回 `{edge_id: 0~1, stats}`，不写库。
③ 重算（可更新）：`POST /recompute-intimacy → recompute_intimacy → _scope_query（4 种 scope）→ _relation_view → _score_edges → MATCH ()-[r]->() SET r.intimacy=$v`，返回更新条数。

## 5. services/file-import-service — 文件解析导入 / 模板引擎 / 主-子任务流水线 / 串行队列 / PG 任务存储

### 5.1 入口与路由（app/main.py）
| 方法 | 路径 | 处理函数 |
|---|---|---|
| GET | /health /healthz | health |
| POST | /api/v1/import/files | import_files（multipart：file + config + template_id） |
| POST | /api/v1/import/preview | preview（解析+校验不写库） |
| GET | /api/v1/import/tasks/{id} | get_task（属主范围可见性） |
| GET | /api/v1/import/tasks | list_tasks（历史列表，按属主过滤） |
| GET | /api/v1/import/formats | formats |
| GET | /api/v1/import/options | import_options_route（权限化选项） |
| GET | /api/v1/import/templates | import_templates_route（内置模板） |

- lifespan：`queue = create_task_queue(...)` → `queue.start()` → finally `queue.stop()`；模块级 `store = create_task_store(...)`、`DEFAULT_STEPS = ["parse", "compute_intimacy"]`；中间件：CORSMiddleware。

### 5.2 函数关系（调用链）
```
main.create_app()
├─ _save_temp / _load_upload / _cleanup_temp   # 上传内容落 /tmp/kg-import-{task_id}
├─ _parse_tables(entities, edges, config)      # get_parser→parser.parse；CSV 按表头 {source,target,linktype} 自动判边表
├─ _parse_uploaded(..., template_id)           # 模板带 entityRule/edgeRule → parse_with_template；否则标准列名直配
├─ _read_upload(f)                             # 读取 + max_file_bytes → 413
├─ preview → parse_config → subject_from_request → check_tags_permitted(403)
│   → _parse_uploaded → map_tables → validate → 截 preview_limit 返回
├─ subtask_parse(ctx, p)                       # 子任务A(parse)：store.set_stage(parsing)
│   → parse_config → check_tags_permitted → 服务端注入 ownerUid
│   → _load_upload → _parse_uploaded → map_tables → validate → store.set_entity_ids
│   → result.errors? PipelineAbort : 返回 {"graph": result, "cfg": cfg}
├─ subtask_compute_intimacy(ctx, p)            # 子任务B(compute_intimacy)：store.set_stage(writing)
│   → IngestionClient(base).compute_intimacy(graph.edges)（intimacy_mode≠off）
│   → 边 props["intimacy"] = 分数 → ingest_nodes → ingest_links → 汇总 imported/skipped/errors
├─ run_main_task(task_id)                      # 队列 handler：
│   → store.get → run_pipeline(steps, ctx, payload, on_step=进度回调)
│   → store.finish / PipelineAbort→store.finish(报告化) / Exception→store.fail；finally _cleanup_temp
├─ import_files → _read_upload → subject_from_request → store.create(steps=DEFAULT_STEPS)
│   → _save_temp → store.set_payload → queue.enqueue(task) → {taskId}
├─ get_task / list_tasks → store.get / store.list(subject, authenticated) + task_visible_to
├─ import_options_route → permissions.import_options(subject)
├─ import_templates_route → templates.engine.list_templates()
└─ formats → parsers.supported_extensions()

pipeline.py
├─ register_subtask(SubtaskSpec) → SUBTASKS 注册表（parse / compute_intimacy 两个实例）
├─ get_subtask(name)
└─ run_pipeline(steps, ctx, payload, on_step)
    # 逐子任务：从 payload 按 spec.inputs 白名单取入参 → fn(ctx, sub_input)
    # → 输出 merge 回 payload（A→B 数据流）；on_step(name, running/success/failed) 回调节点

queue.py
├─ TaskQueue(start/stop/_run)     # 单 worker 线程：acquire→handler→release 循环（daemon）
├─ MemoryTaskQueue                # queue.Queue 进程内串行（TASK_STORE=memory）
├─ PostgresTaskQueue              # pg_advisory_lock(0x4B47494D5030) 全局串行
│   # acquire: 阻塞拿锁 → SELECT .. FOR UPDATE SKIP LOCKED 抢最老 queued
│   # → 置 running 并 commit（行锁释放，advisory 锁会话级保持）→ handler 完成后 release() 放锁
└─ create_task_queue(kind, dsn, handler)

tasks.py
├─ ImportTask(to_dict/summary_dict) + task_visible_to（自己 uid/username 或 subUids 范围）
├─ MemoryTaskStore                # dict 表；create/get/set_stage/set_payload/set_entity_ids/
│                                 # set_current_step/update_subtask/list/finish/fail
├─ PostgresTaskStore              # 表 import_tasks(JSONB) + _P3_COLUMNS 幂等迁移；同接口
└─ create_task_store(kind, dsn)

mapper.py      # map_entities / map_edges / map_tables：保留列→IR，其余列→props；
               # 边 id = sha1(linkType|source|target|businessKeys|rank)；rank：insert 批内递增 / update 恒 0
validator.py   # validate(graph, config) → ValidationResult：id 唯一 / 标识符 / nodeType 白名单 /
               # dangling(skip|auto-create 补实体) / 强制打标配置校验（行级收集，失败计 skipped）
writer.py      # IngestionClient（httpx）：ingest_nodes→POST /ingest/nodes、ingest_links→/links、
               # compute_intimacy→/compute-intimacy（chunk 500，网络/HTTP 错误计数为 skipped）
parsers/       # Parser 注册表（register/get_parser/supported_extensions/norm_value）
               # csv.CsvParser（utf-8-sig + DictReader）；excel.ExcelParser（openpyxl，
               # 双 sheet/sheetMapping，parse_sheets 供模板引擎按 sheet 名取全部表）
templates/engine.py
├─ list_templates / get_template  # BUILTIN_TEMPLATES（tpl-call 通话 / tpl-trade 转账 / tpl-bare 通用）
├─ parse_with_template            # get_parser→parse_sheets 收集全部表 → _sheet_for（显式映射>关键词）
│   → 实体: _extract_entities(列内嵌实体按值去重) / _remap_entity_row；边: _remap_edge_row(剔除已用列)
permissions.py
├─ subject_from_request / from_header → service_common.subject（X-User-Context > JWT > 默认）
├─ classification_max / visibility_allowed / can_set_tenant / can_set_owner / import_options
└─ check_tags_permitted(tags, subject, authenticated)
    # authenticated 时：非 admin 限本租户/归属本人；classification ≤ clearance；visibility ∈ 允许档
```

### 5.3 模块间依赖
```
main ─→ models, mapper, parsers, permissions, pipeline, queue, tasks,
        templates.engine, validator, writer, config
parsers/{csv,excel} ─→ parsers(注册) + models(ParseError)
templates/engine ─→ models, parsers, templates.builtin
mapper ─→ ir, models, parsers          validator ─→ ir, models
writer ─→ ir（httpx → graph-ingestion）
permissions ─→ config, service_common.subject
queue ─→ psycopg(postgres 模式)         tasks ─→ psycopg(postgres 模式)
对外 HTTP：IngestionClient → graph-ingestion POST /ingest/nodes、/ingest/links、/compute-intimacy
Shared：service_common.subject；service_common.jwt 仅 re-export（app/jwt.py）
```

### 5.4 关键数据流
① 上传 → 入队 → 流水线 → 写库：`POST /import/files → import_files`：读文件 → `store.create(status=queued, steps=["parse","compute_intimacy"])` → `_save_temp` 落盘 → `set_payload` → `queue.enqueue`；worker `TaskQueue._run → run_main_task`：`run_pipeline` 步① `subtask_parse`（`_load_upload → _parse_uploaded → map_tables → validate`，产出 ParsedGraph）merge 回 payload；步② `subtask_compute_intimacy`（`IngestionClient.compute_intimacy` 把亲密度写入边 props → `ingest_nodes/ingest_links` 分块 POST graph-ingestion 写库）→ `store.finish(imported/skipped/errors)`；任一步异常 → `PipelineAbort → store.finish`（报告化）或 `store.fail`。
② Postgres 全局串行队列：`PostgresTaskQueue.acquire`：`pg_advisory_lock(KGIMP0)` 阻塞抢锁 → `FOR UPDATE SKIP LOCKED` 取最老 queued → 置 running 并 commit（行锁释放、advisory 锁保持）→ `run_main_task` 执行 → `release()` 关连接放锁 → 下一个任务（多 worker 天然串行）。
③ 预览（不写库）：`POST /preview → preview`：`parse_config → check_tags_permitted(403) → _parse_uploaded → map_tables → validate`，返回前 limit 条 entities/edges/errors/warnings。

