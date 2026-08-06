# 导入模块（file-import-service / import-app）

## 理解 (2026-08-06)

- **一文件一任务**：`POST /api/v1/import/files` 只收单个 `file` + `config` + `template_id`，一次请求生成一个后台任务；多文件由前端逐个提交。
- **解析分层**：解析器层（parsers/ 格式→统一表格）→ 模板层（templates/engine 选表+列重映射到 IR 保留列）→ 复用 mapper/validator/writer。模板引擎不改下游。
- **模板形态**：独立实体表（idColumn/labelColumn）与「边行内嵌实体」（entityRule.columns 按值去重抽取）两种；选表=显式 sheetMapping > 表头关键词，**不做位置兜底**。
- **边公共属性**：`rank`（序号，update 恒 0 / insert 递增，进 id 哈希）、`time`（更新时间，程序写入，不进 id 哈希）；`props` 只存业务/额外列。
- **权限可选项**：`/import/options` 按登录用户返回密级上限/可见性允许集/canSetTenant/canSetOwner；写路径校验越权 403；dev 直连 JWT 兜底（`app/jwt.py`）。
- **历史任务**：`GET /api/v1/import/tasks` 摘要倒序；**落库 Postgres**（`TASK_STORE=postgres`，`import_tasks` 表，`services/file-import-service/app/tasks.py` 的 `PostgresTaskStore`；重启不丢/多 worker 一致；`memory` 兜底）；任务带 `entity_ids`（实际导入实体 id，供跳图谱定位）。
- **前端**：`import-app` 待上传文件框 + 每文件独立配置；自动解析（防抖）；结果 tab = 本次任务 + 历史任务 + 详情 + 查看。
- **查看深链**：查看按钮 → `history.pushState('/graph?ids=...')` + popstate（single-spa 路由）；graph-app 挂载时读 `?ids=`（改自模块级常量，支持多次进出）。
- **owner 约定**：import 默认打标 owner=**用户名**；graph-query L3 / OPA 可见性匹配 owner = uid **或** username（2026-08-06 对齐）；graph-query 有 Bearer JWT 兜底（app/jwt.py + AUTH_SECRET）。
- **ABAC 统一（2026-08-06）**：密级只驱动脱敏（clearance≥数据密级 不脱敏）；可见性只决定可见（public 同租户 / internal 自己及下级 / private 仅自己；无 secret 档）。节点/边写 `ownerUid`（服务端注入），供“内部=自己及下级”匹配。

## 文件关联

- `services/file-import-service/app/templates/engine.py` - 模板引擎（选表/列重映射/实体抽取）
- `services/file-import-service/app/templates/builtin.py` - 内置模板（通话/转账/通用）
- `services/file-import-service/app/mapper.py` - Table→IR（rank/time 公共字段）
- `services/file-import-service/app/ir.py` - ParsedEntity/ParsedEdge（含 rank）
- `services/file-import-service/app/permissions.py` - 主体解析 + 可选项 + 打标越权校验
- `services/file-import-service/app/jwt.py` - HS256 验签（dev 兜底）
- `services/file-import-service/app/main.py` - 端点（preview/files/tasks/templates/options）
- `apps/import-app/src/App.tsx` - 多文件导入 UI + 结果 tab（含查看深链 openGraph）
- `apps/graph-app/src/App.tsx` - 挂载时读 `?ids=` 初始节点
- `services/graph-query-service/app/pep.py` + `app/jwt.py` - L3 可见性 + JWT 兜底
- `policies/kg.rego` - OPA 可见性（owner 匹配 uid/username）
- `docs/parse-template-plan.md` - 模板引擎计划
