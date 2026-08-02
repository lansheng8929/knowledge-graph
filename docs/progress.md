# 知识图谱平台重构 · 进度报告

> 日期：2026-08-03 ｜ 目标架构：[`architecture.md`](./architecture.md) ｜ 执行计划：[`refactoring-plan.md`](./refactoring-plan.md)
> 进度：**M0 🔵 M1 ✅ M2 ✅ M3 ✅ M4 ✅**（ABAC L1–L4 端到端验证通过；剩余为生产化项：审计 sink、Keycloak、投影过滤强化）

---

## 里程碑状态

| 里程碑                       | 状态    | 说明                                                                                                                 |
| ---------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| **M0 基线固化**              | 🔵 部分 | monorepo 骨架、契约测试、契约校验脚本完成；CI/冒烟基线/数据快照未做                                                  |
| **M1 图谱模块化**            | ✅ 完成 | 前后端独立 + OpenAPI SDK + 端到端验证通过（11,000 节点/26,040 关系）                                                 |
| **M2 微服务 + Shell + 网关** | ✅ 完成 | Rule Service、Query 集成、Single-SPA Shell、API 网关、可观测、compose 全栈编排；前端单模块更新（动态 importmap）落地 |
| **M3 数据属性化**            | ✅ 完成 | Ingestion + tenant/classification 打标（强制）+ 存量 backfill 已跑                                                   |
| **M4 ABAC**                  | ✅ 完成 | auth-service(IDP) + 网关 JWT 校验 + L1 粗判 + OPA(L2) + L3 数据过滤 + L4 脱敏 + 审计；端到端验证通过                 |

---

## 已完成明细

### M0 基线（部分）

- [x] T0.1 后端契约测试骨架（`test_contract.py` / `test_validator.py`，13 单测全绿）
- [x] T0.5 monorepo 骨架（workspaces: apps/_、shared/_、graph）
- 补充：`scripts/check-api-contract.sh`（契约漂移检测）

### M1 图谱模块化（完成）

- [x] T1.1 `graph-query-service`：FastAPI 独立服务（`/api/v1/graph/*` + 旧路由兼容；env 化；连接池/超时；CORS 白名单；Pydantic 契约 `Envelope[T]`；validator 白名单防注入；Dockerfile/healthz）
- [x] T1.2 `graph-app`：从 `vite-test` 独立（Vite + React；引擎 workspace/alias 引用；`VITE_API_BASE` 外置）
- [x] T1.3 契约 SDK：`shared/api-client`（openapi-typescript 生成）+ 前端 `graphApi` 类型化客户端（fetch 收敛一处，TS 零错误）
- 修复：init 响应契约 bug（`Envelope[InitData]`）

### M2 微服务 + Shell + 网关（完成）

- [x] T2.1 Rule Service：规则目录 CRUD + 发布 + 值级白名单校验（`RULE_STORE=memory|postgres`，compose 已用 postgres；20 tests passed）+ Query 集成（真实 ruleId 走 `/validate`，`__custom__` 降级）
- [x] T2.2 API Gateway：Nginx（`infra/gateway/nginx.conf`，:8080 路由 graph/rules/auth + 限流 + CORS + `/_authz` JWT 校验）
- [x] T2.3 Single-SPA Shell：`apps/shell` 加载 `graph-app`（生命周期 + domElementGetter + 样式一致 + fitView 相机 bug 修复 + 鉴权注入通道 + 图谱全屏独立 + 隔离约定 `docs/frontend-conventions.md`）
- [x] **T2.3.4 前端单模块更新**：graph-app 独立构建（自包含 ESM）+ shell 动态 importmap（`importmap.json` 控版本），换版本/回滚只改 JSON、shell 零重建（已验证 0.1.0↔0.2.0）
- [x] T2.4 可观测：指标（`/metrics`）+ JSON 日志 + OTel Trace 惰性接入；T2.5 compose 全栈编排（含 PG/OPA/auth）

---

## 剩余生产化项（非阻塞）

- [ ] 可观测采集侧：Loki/promtail、OTel Collector、Prometheus 起 docker（T2.4 配套）
- [ ] 审计 sink 切换 PostgreSQL 已启用（`audit_log` 表，SQL 可查）；如需对象存储（JSONL immutable）可换 `AUDIT_SINK=file`
- [ ] IDP 换 Keycloak（同契约，当前自研 auth-service 已完整）
- [ ] 投影过滤已落地（L3 双保险，验证通过）；后续可加基于返回量的统计防侧信道
- [ ] K8s 清单补全（当前 `infra/k8s/` 仅 query 骨架）+ CI 接入 + ui-kit 提取

### 已完成（M3/M4）

- [x] T3.1 Ingestion Service（`graph-ingestion`，MERGE 幂等 + 强制打标 tenantId/classification/owner/visibility）
- [x] T3.1.3 存量 backfill（默认 default/0/system/internal，已跑）
- [x] T3.2 查询侧透传打标字段
- [x] M4：auth-service(IDP 密码认证+用户管理) + 网关 auth_request JWT 校验 + L1 粗判 + OPA(L2) + L3 数据过滤/投影过滤 + L4 字段脱敏 + 审计（postgres sink）
- [x] 数据库：Neo4j（图主数据）+ PostgreSQL（rules/auth_users/audit_log 三表，已验证落库）

---

## 当前运行方式

| 组件                | 位置 / 命令                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Neo4j               | docker，`infra/neo4j/docker-compose.yml`（bolt :7687，volume 勿乱动）                                             |
| PostgreSQL          | docker，`infra/docker-compose.yml` 的 `postgres`（:5432，库 kg，表 rules/auth_users/audit_log）                   |
| 模拟数据            | `scripts/generate-data.py`（已入库 11,000 节点/26,040 关系）                                                      |
| 后端+网关+OPA+auth  | `infra/docker-compose.yml`（query :8001 / rule :8002 / auth :8004 / gateway :8080 / opa :8181）                   |
| graph-query-service | `services/graph-query-service` → uvicorn :8001                                                                    |
| graph-rule-service  | `services/graph-rule-service` → uvicorn :8002（`RULE_STORE=postgres`）                                            |
| auth-service        | `services/auth-service` → uvicorn :8004（密码登录；演示用户 admin/analyst/viewer/other-tenant，密码 `<user>123`） |
| 前端（独立）        | `bun run --cwd apps/graph-app dev` → :3000                                                                        |
| Single-SPA Shell    | `bun run --cwd apps/shell dev` → :3001（`/graph` 图谱全屏；`?user=admin` 切演示用户）                             |
| API Gateway         | Nginx `infra/gateway/nginx.conf` → :8080（网关强制鉴权：无 token 401）                                            |

> 注：改后端代码后需 `scripts/generate-api-client.sh` 刷新 SDK、`scripts/check-api-contract.sh` 校验契约。

---

## 关键决策（勿改回）

1. 前端微前端 = **原生 Single-SPA**（不用 qiankun/micro-app/Module Federation）
2. 规则契约 = 前端**自由传 conditions JSON**，后端值级白名单校验 + ABAC 最终裁决
3. ABAC = OPA(PDP) + 多层 PEP(L1/L2/L3/L4) + 审计；**M3 打标必须先于 M4**
4. 不发布 npm/pip 包，全部本地 monorepo 引用
5. 网关选型 Nginx

---

## 产物结构

```
apps/shell/              # Single-SPA root-config（:3001，动态 importmap）
apps/graph-app/          # 图谱前端（:3000 / 子应用，独立单文件产物）
services/graph-query-service/   # 图谱查询（:8001，ABAC L2/L3/L4）
services/graph-rule-service/    # 规则 + 白名单校验（:8002）
services/graph-ingestion/       # 数据写入 + 强制打标（:8003）
services/auth-service/          # IDP：密码认证 + JWT + 用户管理（:8004）
shared/api-client/       # OpenAPI 生成的 TS SDK
shared/pep-client/       # Python PEP 客户端（OPA 决策）
shared/audit/            # 审计 sink（log/file/postgres）
graph/                   # WebGL 渲染引擎
policies/                # OPA Rego 策略（kg.rego + 测试）
infra/gateway/           # Nginx 网关配置
infra/neo4j/             # Neo4j compose
scripts/                 # generate-data.py / backfill-tags.py / publish-graph-app.sh / generate-api-client.sh / check-api-contract.sh
docs/                    # architecture / refactoring-plan / progress / frontend-conventions
```

---

## 下一步建议

1. **可观测采集侧**：起 Loki/OTel Collector/Prometheus docker，让日志/链路/指标贯通；
2. **K8s 生产部署**：补全 `infra/k8s/`（每服务 Deployment+Service，当前仅 query 骨架）；
3. **IDP 上真身份**：自研 auth-service 已完整，如需企业级可换 Keycloak（同契约）。
