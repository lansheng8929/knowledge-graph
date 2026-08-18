# 前端函数/组件级关系图（knowledge-graph monorepo）

> 依据：逐一通读 apps/{shell,graph-app,import-app,user-app}/src 下所有 .ts/.tsx。所有函数/组件均为源码实存项，路径以仓库根为基准。

## 0. 总览

| 应用 | 挂载路由 | 生命周期入口 | 状态中枢 |
|---|---|---|---|
| shell | /（root-config） | apps/shell/src/main.ts | 原生 importmap + window.__KG_TOKEN__ |
| graph-app | /graph | apps/graph-app/src/single-spa.tsx | AppContext（5 个 hook 的 ctx 合并） |
| import-app | /import | apps/import-app/src/single-spa.tsx | App.tsx 内 useState 编排（无 Context） |
| user-app | /user | apps/user-app/src/single-spa.tsx | App.tsx 内 useState |

## 1. apps/shell（root-config）

### 1.1 入口与生命周期
- `apps/shell/src/main.ts`：唯一入口（无 single-spa.tsx）。`registerApplication` ×3 + `start()`。
  - 子应用加载器二态：`import.meta.env.DEV ? import("../../<app>/src/single-spa") : import(/* @vite-ignore */ "<app>")`（生产走 importmap 名称解析，避免 vite dev 静态解析报错）。
  - 注册：`graph-app`(activeWhen `pathname.startsWith("/graph")`)、`import-app`(`/import`)、`user-app`(`/user`)；`customProps: () => ({ auth: { token: window.__KG_TOKEN__ ?? "", tenantId: "" } })`——每次激活重算，是鉴权注入通道（T2.3.3）。
- `apps/shell/index.html`：
  - 内联脚本同步 XHR 拉 `./importmap.json` 注入原生 `<script type="importmap">`（react/react-dom 共享 ESM + 子应用版本 URL，T2.3.4 单模块更新）；失败用静态兜底 map。
  - 三个挂载容器 `#single-spa-application:{graph,import,user}-app`（`:empty` 时 `pointer-events:none`）；`#login-view` 登录界面 DOM。

### 1.2 函数清单与职责（main.ts）
- `decodeJwtPayload(t)`：base64url 解码 JWT payload（sub/uid/exp）。
- `refreshUserChip()`：读 `window.__KG_TOKEN__` → 解出 sub/uid 填 `#shell-user` 芯片（点击进 /user）。
- `applyNavVisibility()`：`HIDE_NAV_PREFIXES=["/graph"]` 命中则隐藏 `#shell-nav`（图谱全屏）。
- `refreshActive()` / `onRouteChange()`：`a[data-route]` 高亮（首页精确匹配，其余前缀匹配）；监听 `single-spa:app-change`。
- `tokenExpiry(t)` / `hasValidToken(t)`：解析 exp（秒）判断未过期。
- `showLogin/hideLogin/clearAuth`：登录视图显隐；清 token（sessionStorage `kg-token` 删除 + window 置 undefined）。
- `handleLogin(e)`：POST /api/v1/auth/login → 取 `data.token` → 写 sessionStorage + `window.__KG_TOKEN__` → `refreshUserChip` → `hideLogin` → `startSpa()` → `navigateToUrl("/")`。
- `startSpa()`：幂等 `single-spa.start()`。
- 启动分支：`hasValidToken(token)` 为真直接 `startSpa()`，否则 `clearAuth()+showLogin()`；logout 按钮 → `clearAuth+refreshUserChip+showLogin`。

### 1.3 token 生命周期链路
`index.html 内联登录表单` → `handleLogin` → `window.__KG_TOKEN__`（内存）+ sessionStorage（刷新保持）→ `customProps.auth.token` → 子应用 `mount` 里 `setAuthToken(props.auth.token)` → fetch 自动带 `Authorization: Bearer`。

## 2. apps/graph-app（图谱主应用）

### 2.1 入口与生命周期（single-spa.tsx / main.tsx）
- `domElementGetter()`：查找 `#single-spa-application:graph-app`，不存在则创建并 append 到 body。
- `bootstrap()`：空（预留预加载）。
- `mount(props)`：取 `props.domElement ?? domElementGetter()` → 标 `el.dataset.buildVersion = __BUILD_VERSION__`（T2.3.4 产物标记）→ `props.auth?.token && setAuthToken(...)`（写入 api/client.ts）→ `createRoot(el)` → `<ThemeProvider><App/></ThemeProvider>`。
- `unmount()`：`root?.unmount(); root=null`。
- `main.tsx`：独立运行入口，同一棵树（无 auth 注入），并加载 `../../shell/src/styles/tokens.css`（主题 token 单一来源）。

### 2.2 组件树（App.tsx 顶层编排，581 行）
```
App (apps/graph-app/src/App.tsx)
├─ AppProvider value=appCtx  (AppContext.tsx)
│  └─ PanelProvider           (panel/PanelProvider.tsx：focusStack zIndex 管理)
│     └─ div[ref=containerRef] (onMouseMove→setMousePos)
│        ├─ Toolbar            — 毛玻璃工具栏；props 全来自 App 回调 + useAppCtx 读面板开关/框选模式；内部 ToolbarButton 小组件；嵌 SearchBox
│        ├─ Loading overlay    — loading 时显示（含 loadProgress/initError）
│        ├─ NodeTooltip        — hoveredNode 时渲染，读 ctx.hoveredNode/mousePos；props: loadedNeighbors（getLoadedNeighbors 计算）
│        ├─ LinkTooltip        — hoveredLink 时渲染，读 ctx.hoveredLink/mousePos/linkEndpoints
│        ├─ SnapshotPanel      — historyManagerRef.current + cursor；props: onTakeSnapshot/onJumpTo/onDeleteEntry/onClose
│        ├─ AnalysisPanel      — analysisPanelOpen 时；props: modelRef/viewRef/onClose/onExpand(合并 graphData 进 model+reheat+fitView)
│        ├─ LegendPanel        — legendPanelOpen && !loading；props: onClose；内部 useTheme 取调色板
│        ├─ MiniMap            — miniMapOpen && !loading；props: viewRef；Canvas rAF 渲染 + 点击导航
│        ├─ TimePanel / FilterPanel / TablePanel / PhysicsPanel — 各自开关 state 在 App，读 useAppCtx 的 filters/引力 ctx
│        ├─ SelectionBar       — selectedNodeIds.size>0 时底部条：分析(onAnalyze)/聚焦(fitSelected 平滑平移)/清空(stateManager.setSelectedNodes([]))
│        ├─ RuleMenu           — ruleMenu 非空时；props: node/loadedNeighbors/x/y/onExpand=handleRuleExpand/onClose；组装规则→执行拓出
│        ├─ Expanding 指示浮层 / loadProgress 浮层 / runtimeError 提示
│        └─ SelectionOverlay   — Shift 框选拦截层：调 useGraphSelection 的 startRect/updateRect/finishRect/addPolygonVertex/finishPolygon
```
- 纯函数 `getLoadedNeighbors(graphData, nodeId)`：统计节点各方向已加载邻居数（RuleMenu 剩余可拓数计算用）。
- App 内联回调（useCallback）：`handleSearchSelect`(graphApi.init→applyIcons→合并→setPhysicsCenter→updateGraphData→reheat→pushState"search-add")、`handleAnalyze`(selectedNodeIds→setAnalysisTarget→开面板)、`handleToggleLegend/MiniMap`、`handleFitView`(view.fitView(50))、`handleBack`(history.back())、`handleExportSelection`(fmt→exportSelection)、`toggleTreeLayout`(ForceSimulation{...BASE_FORCE_CONFIG,...intimacyForceFns} ⇄ TreeLayout{rootId=选中首节点})。

### 2.3 hooks 关系（重点 useGraphApp）
**useGraphApp(ids?) — hooks/useGraphApp.ts（544 行，图核心）**
- 产出 refs：`containerRef`(画布 div)、`modelRef`(GraphModel，惰性 new)、`viewRef`(GraphView)、`historyManagerRef`(HistoryManager)、`expansionRef`(ExpansionService)。
- 产出 state：`mousePos/loading/initError/snapshotPanelOpen/legendPanelOpen/miniMapOpen/analysisPanelOpen/analysisTarget/intimacyInfluence/physicsPanelOpen/loadProgress`。
- `streamInitData(ids, onProgress)`：调 `graphApi.initStream`，按 chunk 增量 merge：`meta→total`；`node→applyIcon+push+batchNodes+drainPending+fitView(50)`；`link→linkReady(端点齐) 才入 links，否则 pendingLinks 暂存`；每 300 条 `flush()`（updateGraphData）并 report 进度；返回 `{graphData}`。
- `expansionFetcher(request)`：`graphApi.expandStream` 同款流式 merge（knownIds 增量、BATCH=50），结束 `view.reheat(0.5)`；返回 `{nodes,links,total}`。
- useEffect#1（初始化，[]）：`new GraphView`（arrowDisplay、runtimeTheme=theme、backgroundColor=getPalette(theme).canvas、forceConfig=BASE_FORCE_CONFIG+`buildIntimacyFns(INTIMACY_INFLUENCE_DEFAULT)`、theme.node 8 个 createXxxStyle、theme.link 用 Proxy 兜底 default、renderPlugin=DefaultRenderPlugin(gpu picker, onPlusClick→`model.events.publish("plusToolClick", node)`))；`new ExpansionService({model, metadataManager, loadingManager: model.loadingManager, historyManager, fetcher: expansionFetcher, getContext(相机+state)})`；`setLoading(false)`；清理 `graphView.destroy()`。
- useEffect#2（[theme]）：`view.setRuntimeTheme(theme)` + `setBackgroundColor`。
- useEffect#3（[ids, streamInitData]）：`streamInitData(ids)` → `setLoadProgress(null)` → `historyManagerRef.pushState({type:"init"})`；catch→setInitError。
- 快照/历史：`handleTakeSnapshot`(clone graphData+camera→pushState"snapshot")、`handleJumpToSnapshot(i)`(updateGraphData+还原 stateManager 高亮/选中/隐藏/root + 相机 + hm.jumpTo + reheat)、`handleDeleteSnapshot`、`handleToggleSnapshotPanel`。
- 回退/亲密度：`restoreFromHistory(action)`(goBackSkipType 的 action→恢复数据/状态/相机+reheat)、`handleUndo`(goBackSkipType("snapshot"))、`handleRedo`(goForwardSkipType)、`applyIntimacyInfluence(v)`(setIntimacyInfluence+`view.updatePhysics(buildIntimacyFns(v))`+reheat(0.5))、`intimacyForceFns = buildIntimacyFns(intimacyInfluence)`（树形切回复用）。
- 被谁调用：App.tsx 唯一调用；ctx 经 AppProvider 供全部面板。

**其余 hooks（签名 → 调用方）**
- `useTheme(): {theme,setTheme,toggle}` — hooks/useTheme.tsx；`ThemeProvider` 读写 `localStorage["kg-theme"]` + `documentElement.dataset.theme`；调用方：single-spa/main 的 Provider、useGraphApp、Toolbar、LegendPanel、MiniMap。
- `useGraphHover(modelRef, callbacks): {ctx:{hoveredNode,setHoveredNode,hoveredLink,setHoveredLink,selectedNodeIds,setSelectedNodeIds}}` — hooks/useGraphHover.ts；effect 内 `model.events.subscribe` 6 类事件：nodeHover/linkHover（互斥置空）、plusToolClick→onPlusToolClick、nodeRightClick→onNodeContextMenu(node,screenPos)、nodeClick(ctrlKey 切换)、selectionChange（引用比较防循环）；另一 effect 把 selectedNodeIds 写回 `stateManager.setSelectedNodes`。调用方：App（传回调）。
- `useGraphSelection({viewRef,modelRef})` — hooks/useGraphSelection.ts；state：selectedSelectionMode/selectionMode/rect/polygon/isShiftDown；工具：`getCanvasPos/getTransform/getNodesInRect/getNodesInPolygon`（屏幕→世界坐标）；键盘 Shift 激活、Esc 取消；公开操作：`startRect/updateRect/finishRect`、`addPolygonVertex/updatePolygonCursor/finishPolygon`、`cancelSelection`、`activateRectMode/activatePolygonMode/deactivateSelectionMode`；`applyRectSelection/applyPolygonSelection` 写 `stateManager.setSelectedNodes/clearSelection`；纯函数 `pointInPolygon`（射线法）。调用方：App；其方法被 Toolbar（模式切换）、SelectionOverlay（手势）消费。
- `useGraphFilters(modelRef)` — hooks/useGraphFilters.ts；state：version/timeRange/timeValue/timeActive/playing/attrFilter；订阅 `dataChange` 重算版本；`applyHidden(ts,f,range)` 用 `stateManager.setHiddenNodes/hiddenLinks` 实现时间（边 time>ts 隐藏）与属性（nodeType/gender/caseWeight）过滤，不破坏 model；`onTimeChange/toggleTime/toggleNodeType/updateAttrFilter/resetFilters`；播放用 rAF 匀速推进到 max。调用方：App；读方：TimePanel/FilterPanel。
- `useRuleMenu(containerRef, expansionRef): {handleRuleExpand, ctx:{ruleMenu,setRuleMenu,expanding,runtimeError}}` — hooks/useRuleMenu.ts；空白点击/Escape 关闭；`handleRuleExpand(nodeId, conditions?)` → `expansionRef.current.expand(nodeId, JSON.stringify(conditions))`，错误 5s 后自动清除。调用方：App（handleRuleExpand 传给 RuleMenu.onExpand）。
- `useRequest<T>()` — hooks/useRequest.ts；idle→loading→success|error 状态机 + 序号过期响应丢弃 + AbortController 中断旧请求/卸载中断。调用方：SearchBox（搜索）、AnalysisPanel（analyze 查询）。
- `useDebouncedValue`（未使用）、`useDebouncedCallback`（SearchBox 防抖 300ms 搜索）、`useThrottledCallback`（未使用）— hooks/useDebounce.ts。

### 2.4 状态流：AppContext 与 graphApi
- `AppContext.tsx`：`AppContextValue = useGraphApp.ctx & useGraphHover.ctx & useRuleMenu.ctx & ReturnType<useGraphSelection> & ReturnType<useGraphFilters>`；`AppProvider` 由 App 写入（5 个 hook 的 ctx 展开合并成 appCtx）；`useAppCtx()` 无 Provider 即 throw。
- 读取方（useAppCtx）：Toolbar、SelectionBar、SelectionOverlay、NodeTooltip、LinkTooltip、TimePanel、FilterPanel、TablePanel、PhysicsPanel、AnalysisPanel（共 10 处）。写入方唯一：App.tsx:246-252。
- `api/client.ts`（graphApi 对象）：
  - `setAuthToken(t)`：模块级 authToken（mount 时注入）。
  - 内部 `request<T>(path, body, signal)`：POST JSON + Bearer + {success,data} 解包。
  - 内部 `streamRequest(path, body, onChunk, signal)`：ReadableStream + TextDecoder 按行解析 NDJSON（meta/node/link/done），每 100 行 setTimeout 让出宏任务（防阻塞 d3 物理 timer）。
  - `graphApi.init(ids)` → /graph/init；调用方：App.handleSearchSelect。
  - `graphApi.initStream(ids,onChunk,signal)` → /graph/init/stream；调用方：useGraphApp.streamInitData。
  - `graphApi.search(query,limit=10,signal)` → /graph/search；调用方：SearchBox。
  - `graphApi.expand(body)` → /graph/expand；调用方：无（保留）。
  - `graphApi.expandStream(body,onChunk,signal)` → /graph/expand/stream；调用方：useGraphApp.expansionFetcher。
  - `graphApi.analyze(body,signal)` → /graph/analyze；调用方：AnalysisPanel.runAnalysis。
  - `api/config.ts`：`API_BASE = VITE_API_BASE ?? "/api/v1"`。
- `expansion-service.ts`：`ExpansionService.expand(nodeId, conditions)` → loadingManager.startLoading → fetcher（expansionFetcher）→ `mergeExpansionData`（按 id 去重 updateGraphData）→ pushState{type:"expand"}（含 getContext 的相机/state）→ finally stopLoading。
- 共享模块：`icon-map.ts`(ICON_MAP+applyIcons/applyIcon)、`link-utils.ts`(linkEndpoints 归一化端点)、`physics-config.ts`(BASE_FORCE_CONFIG、INTIMACY_INFLUENCE_DEFAULT、buildIntimacyFns→linkDistanceFn/linkStrengthFn)、`theme.ts`(getPalette/hexToRgba)、`labels.ts`(NODE_TYPE_LABELS/RELATION_LABELS)、`graph-types.ts`(MyGraphView/AppGraphDataGenerics)、`export-utils.ts`(download/exportSelection)、`nodes/*/style.ts`(themed/createTypedStyle + 8 个 createXxxStyle)、`links/default/style.ts`(createDefaultLinkStyle)、`panel/`(PanelProvider/PanelContainer/usePanel/useDrag/PanelLayer)。

### 2.5 核心数据流
**链路 A：挂载 → ?ids= → 流式 init → 增量渲染**
`?ids=n1,n2`(App) → `useGraphApp(ids)` → useEffect#1 建 GraphView/ExpansionService → useEffect#3 `streamInitData` → `graphApi.initStream`(NDJSON) → 每 chunk：node 立即入 batch + `fitView(50)` 边收边渲染；link 端点未齐进 pendingLinks；每 300 条 flush → `model.updateGraphData` → 渲染引擎增量绘制 + loading overlay 进度 → 全部到齐后 `historyManager.pushState({type:"init"})` 供撤销。

**链路 B：hover → tooltip**
渲染器命中检测 → `model.events.publish("nodeHover"/"linkHover")` → `useGraphHover` 订阅写 React state → App 渲染 `<NodeTooltip/>`（读 ctx.hoveredNode + mousePos，mousePos 由容器 onMouseMove 更新）→ 悬浮于鼠标位置；link 同理（LinkTooltip）。hoveredLink 存在时自动清 hoveredNode（互斥）。

**链路 C：选择 → SelectionBar / 导出**
`nodeClick`(ctrlKey 切换) 或框选（SelectionOverlay pointer 手势 → startRect/updateRect/finishRect → getNodesInRect 世界坐标命中 → `stateManager.setSelectedNodes` → `selectionChange` 事件回写 React `selectedNodeIds`）→ SelectionBar 出现（分析/聚焦/清空）；Toolbar 导出 → `exportSelection(model, selectedNodeIds, "json"|"csv")` → download(Blob 触发下载)。

**链路 D（补充）：搜索 → 加节点**
SearchBox 防抖 → `graphApi.search` → onSelect → `handleSearchSelect` → `graphApi.init([nodeId])` → applyIcons → 去重合并 → `view.setPhysicsCenter(视口中心世界坐标)` + 随机散布新节点 → updateGraphData + reheat → pushState"search-add"。

## 3. apps/import-app（数据导入）

### 3.1 入口与生命周期
- `single-spa.tsx`：domElementGetter（`#single-spa-application:import-app`）/ bootstrap 空 / mount（buildVersion 标记 + `props.auth.token→setAuthToken` + `root.render(<App/>)`）/ unmount；另 `main.tsx` 独立运行。`api.ts` 的 setAuthToken 与 graph-app 同构。

### 3.2 组件树与状态编排（App.tsx 857 行，无 Context，全部 useState）
```
App
├─ state: view(import|report，来自 ?mode=)、items[]、taskIds[]、submitting、error、options、templates
├─ 效果：goTab(URL pushState) + popstate 恢复 view；挂载拉 getImportOptions/getTemplates；
│        previewKey(items 签名串) 变化 → 每文件 350ms 防抖自动 preview()（previewSig 防重复解析）；
│        confirmAll：逐文件 submitImport → taskIds → goTab("report")
├─ view==="import" → MultiFileView
│   ├─ MainFileDrop（多选/拖入 → addFiles）
│   └─ FileBox ×items（模板/密级/可见性/业务键 独立配置；切换模板自动带业务键）
│       └─ FilePreview（解析中 spinner / previewError / 统计 Stat ×4 / 错误警告 / details 预览）
│           ├─ EntityTable / EdgeTable（formatProps 渲染属性）
└─ view==="report" → TasksView
    ├─ 本次任务轮询（1.5s getTask × taskIds → current）
    ├─ 历史任务列表（3s listTasks 轮询 + 手动刷新）
    ├─ 任务详情（detailId → getTask）
    └─ 行内"查看"→ openGraph(entity_ids)：pushState(/graph?ids=...) + dispatch PopStateEvent → single-spa 路由切到 graph-app
```
- 辅助：`viewFromUrl()`、`itemSig(it)`（解析输入签名）、`buildConfig(it)`（权限打标 + 模板结构默认 + 文件独立设置 → ImportConfig）、`STATUS_TEXT/STAGE_TEXT/VISIBILITY_LABELS`（后端英文→中文）、`Stat`、`formatProps`。
- `api.ts`：`setAuthToken` + `preview/submitImport/getTask/listTasks/getImportOptions/getTemplates`（统一 `parseData<T>` 解 {data}、`formData` 组 multipart）。
- `types.ts`：`ImportConfig/TagConfig/ParsedEntity/ParsedEdge/PreviewData/ImportTask/ImportOptions/ImportTemplate/View`。

### 3.3 核心链路
`addFiles` → items 增长 → `previewKey` 变化 → 防抖 `preview(file, buildConfig, templateId)` → previewData 填回 item → `confirmAll` 逐文件 `submitImport` → taskIds → report 页 1.5s 轮询 `getTask` → 成功且含 entity_ids → `openGraph` 跳 `/graph?ids=`（single-spa 应用切换，不整页刷新）。

## 4. apps/user-app（个人中心）

- `single-spa.tsx`：同构生命周期（domElementGetter `#single-spa-application:user-app`、mount 注入 auth → `setAuthToken`（api.ts）、`<App/>`、unmount）。
- `App.tsx`（77 行）：挂载后 `fetchUserInfo()` → user/error state → 用户卡片（头像、用户名、uid、租户、密级 CLEARANCE_TEXT、角色、团队、组织路径、上级/下级）+ `Row` 小组件。
- `api.ts`：`setAuthToken` + `fetchUserInfo()` → GET /api/v1/auth/userinfo，解 data.user。
- `types.ts`：`UserInfo{username,uid,tenantId,clearance,roles,teams,orgPath,managerUid,subUids}`。

## 5. 关键结论速记
1. 鉴权：壳层 `window.__KG_TOKEN__`（内存+sessionStorage）→ customProps.auth → 各子应用 `setAuthToken` → fetch Bearer；子应用自身不存 token。
2. 图数据：两条流式链路（initStream/expandStream）共用同一"batch+flush+pendingLinks"增量 merge 模式；统一经 `model.updateGraphData` 驱动渲染，历史全部经 `HistoryManager.pushState`。
3. 面板体系：`PanelProvider`(focusStack) + `usePanel`(zIndex=layer+idx) + `PanelContainer`(useDrag/ResizeHandle) 是所有浮层面板（含 Tooltip）的公共底座；业务状态统一走 AppContext。
4. import-app 与 user-app 均为无 Context 的单页状态编排，与 graph-app 通过 single-spa 路由 + URL（?ids=/?mode=）松耦合联动。
