# graph-ingestion

数据写入 / 安全打标服务（FastAPI）。对应架构 §3.4.2 / 计划 T3.1（M3 数据属性化）。

## 职责

- **在线写入**：节点 / 关系批量入库（`MERGE` 幂等）
- **强制打标**：节点/边必须携带 `tenantId / classification / owner / visibility`，缺标/非法 → 400 拒绝入库
- **鉴权占位**：预留主体属性上下文（Phase 4 网关注入 `X-User-Context` 后接入 PEP）

## 标签规范（T3.1.2）

| 标签             | 类型   | 说明                                          |
| ---------------- | ------ | --------------------------------------------- |
| `tenantId`       | string | 租户标识（多租户隔离）                        |
| `classification` | int    | 密级 0=公开 1=内部 2=秘密 3=机密（比较用 >=） |
| `owner`          | string | 属主（部门/账号）                             |
| `visibility`     | string | `public` / `internal` / `secret`              |

## 路由

| 方法 | 路径                   | 说明                     |
| ---- | ---------------------- | ------------------------ |
| POST | `/api/v1/ingest/nodes` | 批量写入节点（强制打标） |
| POST | `/api/v1/ingest/links` | 批量写入关系（强制打标） |
| GET  | `/health` `/healthz`   | 健康检查                 |

## 本地运行

```bash
cd services/graph-ingestion
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --host 0.0.0.0 --port 8003
```

## 示例

```bash
curl -X POST localhost:8003/api/v1/ingest/nodes -H 'Content-Type: application/json' -d '{
  "nodes": [{
    "id": "person-999",
    "nodeType": "person",
    "label": "测试人",
    "tenantId": "t1",
    "classification": 1,
    "owner": "dept-a",
    "visibility": "internal",
    "props": {"gender": "男"}
  }]
}'
# 缺标签会 400：{"detail":"node person-999: missing required tag: owner"}
```

## 存量补标

```bash
# 为历史数据（无标签）填充默认标签（T3.1.3）
scripts/../scripts/backfill-tags.py    # 见根 scripts/backfill-tags.py
```
