# shared/api-client — 前后端契约 TS SDK（本地引用，不发布）

> 对应架构 §3.2.2 / 计划 T1.3

由 `graph-query-service` 的 OpenAPI 文档（`/openapi.json`）经 `openapi-typescript` 生成，
消除前后端手工对齐（契约单一来源在后端）。

## 生成（需要工具 + 后端运行）

```bash
# 前置：openapi-typescript 已安装（npx 会自动拉取）；graph-query-service 在 :8001 运行
bash scripts/generate-api-client.sh
# 产出：shared/api-client/openapi.json + shared/api-client/generated/graph.ts
```

## 前端引用

`apps/graph-app` 通过 workspace 声明 `@lansheng/api-client:*` 后直接 import 生成类型/请求封装。

## 状态

- [x] 骨架 + 生成脚本（scripts/generate-api-client.sh）
- [x] 后端 OpenAPI schema 细化（Envelope[T] + GraphData/PageResult/SearchData/AnalyzeData）
- [ ] 生成产物（需用户安装 openapi-typescript 后执行）
- [ ] T1.3.2 前端手写 fetch 切换为 SDK
- [ ] T1.3.3 契约校验 CI
