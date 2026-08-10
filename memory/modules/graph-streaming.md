# 图谱数据流式加载（Graph Streaming）

## 理解 (2026-08-10)

- **链路**：Neo4j 惰性游标 → 后端 generator 逐条 `yield` NDJSON 行（`meta`/`node`/`link`/`done`）→ `StreamingResponse`（HTTP chunked，边查边发）→ 前端 `ReadableStream` 按 `\n` 分帧解析 → 攒批增量 merge 渲染（边收边铺开）。
- **后端**（graph-query-service）：
  - `queries.py`：`query_init_stream`（先 `meta{total}`；节点改一次性 `n.id IN $ids`；用 node_session+link_session 双会话并行、主循环「推 1 节点→推 1 边」交错 yield）；`query_expand_stream`（先 meta 后逐条 link/node）；`_stream_link(sid,tid,rel_type,rel)` 统一边组装。
  - `main.py`：`/api/v1/graph/init/stream` + `/expand/stream`（`media_type=application/x-ndjson`，**不加 response_model**；L2 校验在响应前；expand 审计放 gen() finally）。
- **前端**（graph-app）：
  - `api/client.ts`：`streamRequest`（`res.body.getReader()`+TextDecoder，按 `\n` 分帧；**每 100 行 `await setTimeout` 让出事件循环**，否则同步解析阻塞 d3 物理 timer → 节点静止堆中心）；`graphApi.initStream/expandStream`。
  - `useGraphApp.ts`：`streamInitData`/`expansionFetcher`（`pendingLinks` 暂存端点未到齐的边，`drainPending` 节点到齐后解出——避免 `forceLink` 抛 `node not found` 崩溃；BATCH init 300 / expand 50；增量 `updateGraphData` 全量替换但前端手动累加）；`estimateInitialZoom`（收到 meta 按 sqrt(N) 网格估算初始缩放）。
  - `App.tsx`：`loadProgress` 独立右下角进度浮层（「加载中 N/M 节点 · X 边」，pointer-events:none，不依赖 loading overlay）。
- **网关**：`nginx.conf` 正则 location `~ ^/api/v1/graph/(init|expand)/stream$`（优先于前缀 location）加 `proxy_buffering off`+`proxy_cache off`+`proxy_read_timeout 300s`；L1 鉴权最长前缀匹配，`/expand/stream` 命中 `/api/v1/graph/expand`（需 analyst）无需改 auth。

## 坑（重要）

- 流式 **node 必须 yield 完整 `{id, data}`**（只 yield `data` 丢 id → `defaultMapNode` 里 `parseHexColor(s.bgColor)` 崩）。
- `chunk.data` 是 `Record<string,unknown>`，强转 GraphNode/Link 需 `as unknown as X`。
- 边可能先于端点节点到达（并行交错）→ 必须延迟合并，否则 `ForceSimulation.start()` 抛 `node not found` 中断模拟。
- 同步逐行解析阻塞 d3 timer → 周期让出宏任务。
- Pylance 对 `node?.data` 可选访问诊断严格 → `applyIcon` 参数放宽 `any`。

## 文件关联

- `services/graph-query-service/app/queries.py` - 流式 generator（init/expand）+ `_stream_link`
- `services/graph-query-service/app/main.py` - stream 路由（StreamingResponse）
- `apps/graph-app/src/api/client.ts` - `streamRequest` / `initStream` / `expandStream`
- `apps/graph-app/src/hooks/useGraphApp.ts` - `streamInitData` / `expansionFetcher` / `estimateInitialZoom`
- `apps/graph-app/src/App.tsx` - 流式进度浮层
- `apps/graph-app/src/icon-map.ts` - `applyIcon`（单节点图标）
- `infra/gateway/nginx.conf` - stream location `proxy_buffering off`
