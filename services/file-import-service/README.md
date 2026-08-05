# file-import-service

数据解析导入服务（编排层）。对应 `docs/import-module-plan.md`（P1：Excel/CSV 解析 + 校验 + 写入打通）。

## 职责

- **解析**：Excel / CSV 原始文件 → 统一表格（`entities` / `edges`）
- **映射**：表格 → 统一 IR（ParsedEntity / ParsedEdge），含边 id 哈希（`sha1(linkType|source|target|businessKeys…|rank)`）
- **校验**：id 唯一、标识符白名单、端点引用（dangling）、强制打标校验
- **写入**：**不自连 Neo4j**，经 `graph-ingestion`（`POST /api/v1/ingest/nodes|links`）作为唯一写通道
- **任务**：后台导入任务，含状态 / 进度 / 报告

## 路由

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/v1/import/files` | multipart 上传（`entities`/`edges` 文件 + `config`）→ 后台任务，返回 `taskId` |
| POST | `/api/v1/import/preview` | 解析 + 校验**不写库**，返回预览（前 N 条 + 错误/警告） |
| GET | `/api/v1/import/tasks/{id}` | 任务状态 / 进度 / 报告 |
| GET | `/api/v1/import/formats` | 支持的格式 + 表头约定 |
| GET | `/health` `/healthz` | 健康检查 |

## 文件格式约定（P1，完美格式化）

一个文件 = 两个结构相同的表（Excel 用两个 sheet；CSV 用 `entities`/`edges` 两个文件）：

```
entities:  id | nodeType | label | icon | <任意属性列...>
edges:     id | source | target | linkType | label | time | rank | <任意属性列...>
```

- 保留列之外的列自动进 `props`；
- `edges.time` = 边的更新时间（缺省自动填导入时间）；`edges.rank` 通常自动生成；
- 业务时间（如转账时间）放 `props`（如 `transTime`）。

## 配置（可选，`config` 表单字段 JSON）

```jsonc
{
  "tags": { "tenantId": "t1", "classification": 1, "owner": "dept-a", "visibility": "internal" },
  "edge": {
    "businessKey": [{ "col": "流水号" }],
    "insertMode": "update"            // update=更新相同边(默认) | insert=新插入边(rank+1)
  },
  "nodeTypeDefault": "person",
  "nodeTypes": ["custom_type"],
  "strictNodeTypes": false,
  "dangling": "skip",                 // skip(默认) | auto-create
  "danglingNodeType": "entity",
  "sheetMapping": { "entities": "人员表", "edges": "转账关系" }   // Excel sheet 映射（可省略）
}
```

- `sheetMapping` 用于指定 Excel 里哪个 sheet 抽 entities / edges；**省略时默认按 sheet 顺序匹配**——第一个非空表 = entities，第二个 = edges。

## 本地运行

```bash
cd services/file-import-service
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --host 0.0.0.0 --port 8005
```

默认打标（未配置 `config.tags`）：`tenantId=default / classification=0 / owner=system / visibility=internal`。

## 写入通道

`INGESTION_BASE_URL`（默认 `http://localhost:8003`）指向 graph-ingestion；写入口强制打标，本服务按配置注入标签后转发。
