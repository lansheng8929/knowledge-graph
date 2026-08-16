# 知识图谱平台 — 当前代码架构全景

> 日期：2026-08-15　分支：rebuild
> 本文是「完整解释当前代码架构」的总纲：系统拓扑、认证与数据链路、模块间函数关系索引。
> 函数级细节见三份分卷：[`docs/backend-call-graph.md`](./backend-call-graph.md)（后端六服务）、
> [`docs/frontend-call-graph.md`](./frontend-call-graph.md)（前端四应用）、[`docs/engine-call-graph.md`](./engine-call-graph.md)（WebGL 引擎）。

---

## 1. 系统拓扑（部署形态）

```
┌─ 浏览器 ──────────────────────────────────────────────┐
│ single-spa 微前端（原生 importmap 共享 react/react-dom）│
│   shell(root-config) → graph-app / import-app / user-app │
└──────────────┬──────────────────────────────────────┘
               │ /api/*  (nginx :8080 网关)
┌──────────────▼──────────────────────────────────────┐
│ 网关 infra/gateway（nginx）                           │
│  auth_request /_authz → auth-service（验 JWT + L1 粗判）│
│  ├→ /api/v1/auth/*            → auth-service:8001     │
│  ├→ /api/v1/graph/* + /stream → graph-query:8002      │
│  ├→ /api/v1/rules/*           → graph-rule:8003       │
│  ├→ /api/v1/ingest/*          → graph-ingestion:8004  │
│  └→ /api/v1/import/*          → file-import:8005      │
└───────┬────────────────┬───────────────┬─────────────┘
        │                │               │
   Neo4j:7687      PostgreSQL:5432   OPA:8181
   (图数据)        (任务/规则/审批/   (ABAC PDP)
                   审计/用户 文档表)   policies/kg.rego
```

- **一键编排**：`scripts/up.sh dev|prod|down|status`——dev 全容器 + 源码挂载热更新（后端 --reload、前端 vite HMR），prod 全容器 + 网关 + 前端 Nginx；dev/prod 共用 Neo4j 数据卷（`infra/neo4j` 独立 compose，up.sh 自动切换）。
- **工作区**：bun workspaces（apps/*、shared/*、graph）；Python 服务各自 venv + pip editable（shared 包经 `pip install -e` 挂入各服务）。

## 2. 请求生命周期（一条请求如何走完全平台）

```
浏览器
 └─ shell 启动：hasValidToken ? startSpa : showLogin
     └─ handleLogin → POST /api/v1/auth/login
         └─ auth.login: store.get → verify_password → compute_sub_uids
             → issue(JWT: sub/uid/tenantId/clearance/roles/teams/orgPath/managerUid/subUids)
             → token 存 sessionStorage + window.__KG_TOKEN__
 └─ 子应用 mount：props.auth.token → setAuthToken(api/client) → 后续 fetch 带 Bearer
     └─ 业务请求 → 网关 nginx
         ├─ auth_request /_authz → auth.authz: _bearer_token → verify
         │    → subject_from_payload → _l1_check(X-Original-URI)  # 前缀角色粗判
         │    → 200 + X-Subject-Context JSON
         └─ auth_request_set 注入 X-User-Context → proxy_pass 上游服务
             └─ 服务端 subject_from_request（service_common.subject）
                 # X-User-Context（可信）> Bearer JWT（dev 直连兜底）> 默认主体
```

## 3. 认证 / 授权 / 审计三层（ABAC）

| 层 | 位置 | 机制 |
|---|---|---|
| L1 网关 | auth-service `authz` + nginx auth_request | JWT 验签；路径前缀→必需角色（`L1_RULES`：/api/v1/ingest/→privileged、/graph/expand→analyst） |
| L2 服务级 | graph-query/rule 的 `_l2_check` | `pep_client.PepClient` → OPA `data.kg.allow`（subject×resource×action），deny → 403 + 审计 |
| L3 数据级 | graph-query `l3_conditions`（Cypher 改写）+ `l3_visible`（内存投影） | 租户隔离 + 可见性分层：public 同租户 / internal 自己及下级（subUids）/ private 仅本人；2026-08-15 修复无属主误放行漏洞 |
| L4 字段脱敏 | graph-query `mask_sensitive` | clearance < 数据密级 → label 掩码（138****1234） |
| 审计 | `audit_sink`（log/file/postgres 三实现） | query/rule 的 `observability.audit` 统一记录 {subject,resource,action,decision,reason} |

## 4. 数据模型与存储

- **Neo4j**（唯一写通道 graph-ingestion）：节点 `(:{nodeType} {id})`、关系 `(s)-[r:{linkType} {id}]->(t)`；强制打标 `tenantId/classification/owner/visibility/ownerUid`（`tags.validate_tags` 拒写缺标）；边顶层属性 `intimacy`（亲密度 0~1）。
- **PostgreSQL**：
  - `auth_users`（auth-service，组织树 managerUid）
  - `rules`（rule-service，definition JSONB）
  - `import_tasks`（file-import，JSONB + 幂等列迁移；advisory lock 全局串行队列）
  - `audit_log`（audit_sink postgres 实现）
- **OPA**：`policies/kg.rego`——单策略文件，决策入口 `data.kg.allow`，owner 匹配 uid/username（与 L3 同谓词，双保险）。

## 5. 服务间调用矩阵（HTTP）

| 调用方 | 被调用方 | 接口 | 用途 |
|---|---|---|---|
| graph-query-service | graph-rule-service | POST /api/v1/rules/validate（urllib，3s 超时） | 拓出前值级白名单校验；不可达回退本地 validator |
| file-import-service | graph-ingestion | POST /ingest/nodes、/ingest/links、/compute-intimacy（httpx，chunk 500） | 导入写库 + 亲密度预计算 |
| graph-query / graph-rule | OPA | POST /v1/data/kg/allow | L2 决策 |
| 全部服务 | auth-service | 网关 auth_request /_authz（间接） | 验签 + 主体注入 |

## 6. 共享代码（跨服务/跨应用单一来源）

| 包 | 内容 | 使用者 |
|---|---|---|
| `shared/service-common`（Python） | `jwt.py`（HS256 签发/校验）、`subject.py`（主体解析：header/JWT/默认，参数化服务差异） | auth（jwt+payload）、query/rule/import（subject） |
| `shared/pep-client`（Python） | `PepClient`（OPA 客户端，fail-closed） | query、rule（L2） |
| `shared/audit`（Python） | `AuditSink` log/file/postgres + `create_sink` | query、rule（observability.audit） |
| `shared/api-client`（TS） | OpenAPI 生成类型（components） | graph-app（类型仅用，运行时走 fetch） |
| `shared/web-constants`（TS） | `CLEARANCE_TEXT/CLEARANCE_OPTIONS` | import-app、user-app |
| `graph/`（TS 引擎） | @lansheng/knowledge-graph（见引擎分卷） | graph-app（vite alias 直连源码） |

## 7. 四大端到端业务链路

### 链路 1：数据导入 → 亲密度 → 图谱可见
```
import-app 选文件+模板 → preview（解析+校验不写库，权限打标校验）
 → confirmAll → POST /import/files → file-import.import_files
 → store.create(queued, steps=[parse, compute_intimacy]) → _save_temp → queue.enqueue
 → PostgresTaskQueue（advisory lock 全局串行）
 → run_main_task → pipeline.run_pipeline:
     A=subtask_parse:      _load_upload → parse_with_template/map_tables → validate → ParsedGraph
     B=subtask_compute_intimacy: IngestionClient.compute_intimacy（graph-ingestion 只读算分）
                              → 边 props["intimacy"] → ingest_nodes/ingest_links（写 Neo4j）
 → store.finish(imported/skipped/errors)
 → import-app 轮询 getTask → 成功 → openGraph → /graph?ids=entity_ids
 → graph-app 挂载读 ?ids= → initStream 流式加载 → 可见（L3 过滤）
```

### 链路 2：图谱查询（流式，边收边渲染）
```
graph-app useGraphApp.streamInitData → graphApi.initStream（fetch chunked）
 → 网关 stream location（proxy_buffering off）
 → graph-query query_init_stream：l3_conditions 过滤 → 节点/边双游标交错
    yield meta{total}/node/link/done（_stream_link 组装；mask_sensitive L4）
 → 前端 ReadableStream 按行分帧 → 每 100 行让出事件循环
 → pendingLinks 暂存端点未到齐的边 → 每 300 条 flush → model.updateGraphData
 → GraphView.rebuildFromModel → plugin.syncData → layout.setData + start
 → d3 tick → onPhysicsTick 回写坐标 → 每帧 WebGLRenderer.render（~6 draw calls）
```

### 链路 3：规则校验拓出（值级白名单 + L2 + L3）
```
RuleMenu 组装规则（targetType/relationType/direction/filters）
 → handleRuleExpand → ExpansionService.expand
 → graphApi.expandStream → graph-query expand_graph_stream
 → _l2_check("expand")（OPA）→ RuleServiceClient.validate(ruleId, conditions)
    （rule-service validate_conditions_endpoint → parse_conditions → store.get(rule)
      → validator.validate_conditions：标识符防注入 + allowed* 白名单）
 → query_expand_stream：_build_match_clause/_build_where_clause（含 l3_conditions）
 → UNION ALL → 流式 yield → mergeExpansionData 去重 → pushState{type:"expand"}
```

## 8. 文档索引

| 文档 | 内容 |
|---|---|
| `docs/architecture.md` | 原始架构设计（Phase 0-4 演进、ABAC 设计、待确认问题） |
| `docs/backend-call-graph.md` | 后端 6 服务全部函数调用链（路由表/模块依赖/数据流） |
| `docs/frontend-call-graph.md` | 前端 4 应用组件树/hooks 关系/状态流/数据链路 |
| `docs/engine-call-graph.md` | WebGL 引擎类关系/渲染管线/事件体系/扩展点 |
| `docs/import-module-plan.md` / `intimacy-pipeline-plan.md` / `parse-template-plan.md` | 各模块设计计划与待办 |
| `docs/code-review-2026-08-15.md` | 代码优雅度审查（三批清理状态） |
| `memory/modules/*.md` | 模块理解沉淀（含坑记录） |
