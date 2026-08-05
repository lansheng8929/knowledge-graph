# business-core-service

**通用业务能力组件**：审批流 / 任务分派 / 报表聚合 / 审计责任。

定位：**不感知任何具体业务**（图谱导入、案件、资产等都能对接），只提供数据存储 + 状态/审批/分派/聚合/审计逻辑。
业务方通过通用契约接入：`objectType + objectId + payload(JSON)`，业务对象由业务方自己维护。

主体身份统一从 `X-User-Context`（`uid/tenantId/orgPath/subUids/teams/managerUid`）读取：
审批自动路由、任务组织分派、报表组织维度、审计责任归属全部按组织层级自动计算。

## 路由

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/v1/approval/requests` | 创建审批单（approvers 空 → 自动路由到申请人 managerUid） |
| GET | `/api/v1/approval/requests` | 列表（可按 status/objectType 过滤，仅本人相关） |
| GET | `/api/v1/approval/requests/{id}` | 审批单详情 + 审批记录 |
| POST | `/api/v1/approval/requests/{id}/action` | approve / reject / comment |
| POST | `/api/v1/tasks` | 创建任务（直接指派或按组织分派） |
| GET | `/api/v1/tasks` | 任务列表（我的 / 我下级的 / 按状态） |
| POST | `/api/v1/tasks/{id}/status` | 更新任务状态（doing/done/cancelled） |
| POST | `/api/v1/reports/definitions` | 定义报表（dataset + groupBy） |
| GET | `/api/v1/reports/definitions` | 报表定义列表 |
| POST | `/api/v1/reports/definitions/{id}/run` | 执行聚合（只统计自己及下级组织的数据） |
| POST | `/api/v1/audit/events` | 上报审计事件（自动带 actor + 责任上级） |
| GET | `/api/v1/audit/events` | 审计追溯（按租户/对象/时段，仅自己及下级组织） |
| GET | `/health` `/healthz` | 健康检查 |

## 本地运行

```bash
cd services/business-core-service
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --host 0.0.0.0 --port 8006
```

存储：`BUSINESS_CORE_STORE=memory|postgres`（默认 memory）；生产 `PG_DSN` 指向 PostgreSQL。

## 通用契约

业务方对接时只传：

```jsonc
{ "objectType": "import_task", "objectId": "c68741ce8f74",
  "payload": { "entityCount": 4, "tags": {...} } }
```

模块不解释 payload 语义；权限/组织维度一律来自 `X-User-Context`。
