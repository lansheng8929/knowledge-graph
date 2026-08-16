# @lansheng/knowledge-graph 3.0.0-beta.1 — graph/src 类/函数级关系图

> 基于源码逐一确认（仅列真实存在的类/方法）。路径相对 `graph/src/`。

## 1. 公开 API 面

### 1.1 顶层入口 `index.ts`
| 导出 | 来源模块 |
|---|---|
| `GraphView` / `GraphViewOptions` | `client/view-new.ts`（新版 WebGL 视图） |
| `GraphRenderer` / `DefaultRenderPlugin` | `renderer/graph-renderer.ts`、`renderer/default-render-plugin.ts` |
| `ForceSimulation` / `TreeLayout` / `Layout` / `ForceConfig` / `SimNode` / `SimLink` | `physics/*` |
| `GraphModel`、`TagManager`、`LoadingManager`、`StateManager`、`StyleManager`、`GraphEvents`、`GraphEventMap` | 对应顶层模块 |
| `MetadataManager` / `HistoryManager` / `StyleRegistry` | `meta-manager.ts` / `history-manager.ts` / `style-registry.ts` |
| 主题/工具/常量/类型 | `theme.ts`、`utils.ts`、`constants.ts`、`type.ts`、`client/type.ts` |
| `entity`（类型+样式） | `entity/index.ts`（default 节点/边） |
| `d3` 命名空间 | `vendor/d3-force/src/index.js`（d3-force 源码转手） |

### 1.2 `client/index.ts`（实体注册面 + 视图）
`EntityRegistry`、`LinkRegistry`、`EntityRenderer/EntityCreator` 等类型、`GraphNode/GraphLink/GraphViewModel/GraphDataGenerics/StateConfig`、`makeDrawWrapper` 等 Canvas 工具、`GraphView`。

### 1.3 `history-manager.ts` — HistoryManager
快照撤销/重做栈（不依赖 React）：`pushState`、`goBack`/`goForward`、`goBackSkipType`/`goForwardSkipType`、`jumpTo`、`deleteEntry`、`goToFirst/goToLast`、`clear`；getter `canGoBack/canGoForward/currentState/cursor/length`。类型 `HistoryState`、`HistoryAction`。

### 1.4 `meta-manager.ts` — MetadataManager
实体元数据 Map（`type:id` 键）：`setMeta/getMeta/deleteMeta/clear`、分页 `updatePagination/getPagination`、拓出规则 `setRules/getRules`、`size`。类型 `EntityMeta/MetaEntityIdentifier`。

## 2. 核心类关系

### 2.1 GraphView（`client/view-new.ts`）— 组合根
字段：`model: GraphModel`、`renderer: GraphRenderer`、`layout: Layout`、`events: GraphEvents`、`styleManager`、私有 `nodeMap/linkMap`（GraphNode↔RenderNode 索引）、`rawTheme/runtimeTheme`。

**构造链**（初始化顺序决定依赖）：
1. `new GraphRenderer({container,…,renderPlugin})` → `new WebGLRenderer`（建 canvas + WebGL2 上下文 → `renderPlugin(gl,canvas)` 建插件 → `new InteractionManager(canvas, plugin, callbacks)` 并共享 `camera.state` → ResizeObserver → `startRenderLoop()`）
2. `styleManager.init(plugin.getDefaultStyle() 合并 opts.theme 静态项)`
3. `layout = opts.layout ?? new ForceSimulation(opts.forceConfig)`；挂 `onTick = onPhysicsTick`、`onEnd = 首次 fitView(40)`
4. `setupRendererCallbacks()`（renderer 回调 → events.publish，见 §5）
5. `rebuildFromModel()`

**数据流方法**：`rebuildFromModel(fitView)`（model→render nodes/sim nodes，见 §4）；`defaultMapNode`（主题回调/静态→NodeStyle→StateManager 状态→`getNodeStyleByStateType`→RenderNode，写回 `styleManager.setNodeStyle`）；`defaultMapLink`（同构，intimacy→simLinks）。
**物理回调**：`onPhysicsTick(simNodes)` — sim 坐标回写 model 节点 → `renderer.updateNodePositions`（O(1) simById 更新边端点）→ 触发 `plugin.afterPositionUpdate`。
**状态视觉**：`syncAllNodeStyles/syncAllLinkStyles`（遍历 renderer.nodes/links，按 `plugin.resolveNodeState/resolveLinkState` + 状态样式重算颜色透明度）。
**公开 API**：`updateView`、`focusNodeById`、`setLayout`（stop/destroy 旧布局→重建）、`fitView`、`getRenderer/getLayout`、`updatePhysics`（仅 ForceSimulation）、`reheat`、`setPhysicsCenter`、`settleLayout`、`getCanvas`、`clearHover`、`refreshTheme`、`setRuntimeTheme`、`setHighlightNodes`、`setHoveredNodes`、`destroy`。

### 2.2 GraphModel（`model.ts`）— 数据/状态/样式门面
字段：`cache: GraphViewModel`、`events`、四个 Manager（见下）。
- `updateGraphData({graphData})` → `styleManager.updategGraphModelData(cache)` + `events.publish("dataChange")`
- `getGraphModelData()` = cache ∪ `stateManager.getState()`
- `getNodeById/getLinkById`（线性查找）
- 已废弃委托：`updateMetaData→stateManager.updateState`、`updeteFoucsNodes/updateSelectedNodes/updateHiddenNodes→stateManager`（自动关联邻接边/目标节点）

**Managers 依赖关系**：
`GraphModel.events` → `new TagManager(events)`（内部 `TagManager.model = new TagManagerModel(events)`）、`new LoadingManager(events)`（内部 `LoadingManager.model = new LoadingManagerModel(events)`）、`new StateManager(events)`、`new StyleManager(cache)`。
- **StateManager**（`state-manager.ts`）：九类状态各配 set/add/remove/get/is/clear（highlight/selected/hidden/root/hovered × nodes/links），另 `getNodeState/getLinkState`（按优先级折叠）、`updateState(config)`（批量，变更才 publish）、`reset`、`getState`；每次变更 publish 对应事件 + `publishMetaDataChange()`。
- **TagManager**（`tag-manager.ts`）：模型层 `TagManagerModel`（`addTag/addNodeTag/addLinkTag/removeAllTags/getTags/getAllTags/updateTagByType/…`，变更 publish `tagChange`）+ 视图层 `TagManager`（`setGlobalVisible/getVisibleTags` 等，委托 model）。`Tag` 类型含 `targetId/targetType/label/visible/icon/metadata`。
- **LoadingManager**（`loading-manager.ts`）：`LoadingManagerModel`（`setLoading/startLoading/stopLoading/updateProgress/isLoading/getAllLoadingStates/setLoadingForNodes/clearAll/export/import`，publish `loadingChange`）+`LoadingManager`（globalVisible 门面）。
- **StyleManager**（`style-manager.ts`）：`init(默认样式)`、`update(深度合并)`、`getNodeStyle/getLinkStyle`（type 基线 + 实例样式覆盖）、`setNodeStyle/setLinkStyle`、`cleanNodeStyle/cleanLinkStyle`、`clear`。

### 2.3 Renderer 体系（`renderer/`）
- **GraphRenderer**（门面，`graph-renderer.ts`）：持有 `backend: WebGLRenderer`；getter `canvas/interaction/picker/nodes/links/plugin`；回调桥接（`onNodeClick…onPlusClick` → backend 同名）；统一 API `updateData/updateNodePositions/fitView/focusNode/setBackgroundColor/destroy`。
- **WebGLRenderer**（`webgl-renderer.ts`）：Canvas/上下文/RAF 循环/ResizeObserver/相机；`updateData→plugin.syncData`；`render()`（clear → `plugin.render(ctx)` → 同步 `plugin.tx/ty/k` → 遍历 `plugin.getOverlays()` 渲染 pick 缓冲+视觉）；`fitView(padding, animate)`（bbox→k/t，`animateTransform` easeOutCubic 320ms，done 时 `camera.reset()+onZoom`）；`focusNode`；`pick()` 委托插件；`destroy()`（停 RAF、`interaction.detach/reset`、`plugin.destroy`、移除 canvas）。辅助 `encodePickColor/decodePickColor`（索引↔RGB24）。
- **DefaultRenderPlugin**（`default-render-plugin.ts`）：组合 NodeBatchRenderer / LinkBatchRenderer / TextLabelRenderer(2048) / IconAtlas / WebGLPicker(默认) 或 CpuPicker / PlusBadgeLayer。`render(ctx)` 依次：边→节点→节点标签→边标签；`syncData`（→picker.syncData + updateBadges + labelRenderer.preRegister）；`resolveNodeState`（hidden>hovered>selected>root>highlighted>regular）；`resolveLinkState`（hidden>hovered>selected>regular）；`getOverlays()=[plusBadgeLayer]`；`afterPositionUpdate→updateBadges`。
- **NodeBatchRenderer**（`node-batch.ts`，实现 `NodeRenderPipeline`，`@deprecated` 接口在 `node-pipeline.ts`）：instanced SDF 圆，`render(nodes,w,h,tx,ty,scale,zOffset,iconAtlas)` — 14 路 instanced attrib（center/radius/color/strokeColor/strokeWidth/shapeType/shapeParam/showPlus/plusOffsetXY/plusScale/hasIcon/iconUv）+ 单位 quad VAO + 图标纹理 TEXTURE1，单次 `drawArraysInstanced(TRIANGLES,0,6,N)`；`renderPicking` 同构（gl_InstanceID 编码索引）；动态 buffer 缓存复用（`_dynBufs`，`uploadDynamic` 首建后 bufferSubData）；`shapeToType` 恒 0（仅圆形）。
- **LinkBatchRenderer**（`link-batch.ts`）：按 (sourceId|targetId) 分组计算二次 Bézier 控制点（平行边错开 CURVE=12），`render` = 线段 instanced TRIANGLE_STRIP + 箭头（关混合）两次 draw；`renderPicking(links,…,idOffset)` 线宽+8；4 个 program（line/linePick/arrow/arrowPick）。
- **TextLabelRenderer**（`text-label.ts`）：`buildNodeLabels`（缩放阈值 labelMinScale、节点下方 gap）/`buildLinkLabels`（沿弧线 Bézier 中点 + 角度旋转）产出 `CharInfo[]`；`render` 逐字符 instanced；`preRegister` 预热字符。
- **TextureAtlas**（`atlas.ts`）：字符 SDF 图集（2048 槽位、getOrCreate/upload/clear）。
- **IconAtlas**（`icon-atlas.ts`）：图片 URL 图集，异步 `loadImage` contain 缩放，加载后 dirty→上屏。
- **PlusBadgeLayer**（`plus-badge-layer.ts`，实现 `GraphOverlay`）：白底圆+"+"徽标；`updateBadges`、`render`、`renderPickBuffer`（自持 FBO）、`pick`、capture-phase `pointerdown` 拦截→`onPlusClick`；独立于主交互层。
- **Camera**（`camera.ts`）：`pan/zoomTo/setZoom/screenToWorld/worldToScreen/reset`；状态 `{x,y,k}`，k∈[0.03,10]。
- **shaders.ts**：从 `renderer/shaders/*.glsl` 以 ?raw 导入 13 组 VS/FS（node/line/arrow/text/plus 各含 render+pick 变体）。

### 2.4 Picker（`picker.ts` 接口：`tx/ty/k + syncData + resize + pick + destroy`）
- **WebGLPicker**（`webgl-picker.ts`，默认）：离屏 FBO+颜色纹理+深度 renderbuffer；`pick(screenX,screenY)` 时绑定 FBO → linkRenderer.renderPicking（z=0, idOffset=节点数）→ nodeRenderer.renderPicking（z=-0.5）→ `readPixels(1,1)` 解码 gl_InstanceID → `nodeIds[index]` 或 `linkIds[index-linkOffset]`；注意 DPR 坐标映射与 Y 翻转。
- **CpuPicker**（`cpu-picker.ts`）：屏幕→世界坐标后反向遍历：节点 SDF 圆（`d≤2.0`）→ 边点到线段距离（`≤(width+4)/k`），零 GPU 开销，可互换。

### 2.5 Physics（`physics/`）
- **Layout 接口**（`layout.ts`）：`setData/start/stop/reheat/setCenter?/settle?/fixNode/releaseNode/onTick?/onEnd?/destroy`。
- **ForceSimulation**（`simulation.ts`，d3-force 包装）：`start()` 组 forceLink（distance/strength 可经 `linkDistanceFn/linkStrengthFn` 按 intimacy 定制）+ forceManyBody + forceCenter + forceCollide，`velocityDecay/alphaMin`，tick/end 派发 onTick/onEnd；`settle(iterations=300)`（同步 tick + 手动派发）；`reheat/updateConfig/setCenter/fixNode/releaseNode/getNodePositions/alpha`。
- **TreeLayout**（`tree-layout.ts`）：BFS 分层（rootId 缺省首节点，maxDepth 截断，未连通平铺底层），同步 `compute()` 派发 onTick/onEnd；fix/reheat 为 no-op。

### 2.6 InteractionManager（`interaction-manager.ts`）— 事件→回调分发
监听 `pointerdown/move/up/leave + wheel + contextmenu`；状态机 `isDragging/dragNodeId/isPanning/hoveredId/hoveredType`：
- pointerdown：`picker.pick` → node(左键)→`onNodeClick`+拖拽；link→`onLinkClick`；空→`onBackgroundClick`+平移
- pointermove：拖拽→`onNodeDrag`（WebGLRenderer 内 ÷k 换算世界坐标并 `afterPositionUpdate`）；平移→改 `transform`+`onPan`；悬停 diff→`onNodeHover/onLinkHover`（互斥置 null）+ cursor
- wheel：以鼠标世界坐标为中心缩放（0.95/1.05，k∈[0.03,10]）→`onZoom`
- contextmenu→`onNodeContextMenu`；pointerleave→清 hover。
回调经 WebGLRenderer.makeCallbacks → GraphRenderer 桥接 → GraphView.setupRendererCallbacks → `events.publish`。

## 3. 插件/扩展点
| 契约 | 实现者 | 说明 |
|---|---|---|
| `RenderPlugin`（`render-plugin.ts`，extends Picker）| `DefaultRenderPlugin` | `render(ctx)/getOverlays/getDefaultStyle/syncData/pick/resize/destroy` + 可选 `afterPositionUpdate/resolveNodeState/resolveLinkState`；经 `GraphViewOptions.renderPlugin(gl,canvas)` 工厂注入，可整体替换 |
| `Layout`（`physics/layout.ts`）| `ForceSimulation`、`TreeLayout` | `GraphViewOptions.layout` 注入；`setLayout()` 运行时切换 |
| `Picker`（`renderer/picker.ts`）| `WebGLPicker`、`CpuPicker` | `pickerMode: "gpu"|"cpu"` 选择 |
| `GraphOverlay`（`renderer/graph-overlay.ts`）| `PlusBadgeLayer` | 主画布之上的独立层，自持 FBO 拾取与事件 |
| `EntityRenderer/EntityCreator`（`client/entity-types.ts`）| `createDefaultEntity`（`entity/default/default.client.ts`）、`entity/common.ts` 的 `createEntity` 组合器（before/after 钩子 + tools）| 经 `EntityRegistry` 注册；`create-entity.js` 脚手架生成新实体 |
| `LinkRenderer/LinkCreator`（`client/link-types.ts`）| `createDefaultLinkEntity`（`entity/link/default/default.client.ts`）| 经 `LinkRegistry` 注册 |
| `NodeRenderPipeline`（`node-pipeline.ts`，@deprecated）| `NodeBatchRenderer` | 兼容旧接口 |

> 注：EntityRegistry/LinkRegistry 是旧 Canvas2D 时代的实体扩展面；新版 WebGL 渲染走 RenderPlugin。两者并存导出。

## 4. 渲染管线（一帧完整流程）
1. **数据变更**：`GraphModel.updateGraphData` → publish `dataChange` → `GraphView.rebuildFromModel`：`defaultMapNode/defaultMapLink`（主题+状态→RenderNode/RenderLink）→ `renderer.updateData` → `plugin.syncData`（picker/徽标/标签字符预热）→ `layout.setData(simNodes,simLinks)+start()`。
2. **物理演化**：d3 simulation tick → `onPhysicsTick` 回写 model 节点坐标 → `renderer.updateNodePositions`（直接改 RenderNode.x/y）→ `plugin.afterPositionUpdate`（徽标跟随）。
3. **每帧**（WebGLRenderer RAF `render()`）：clear → `plugin.render(ctx)`：
   - `LinkBatchRenderer.render`：Bézier 控制点分组 → instanced 线段（1 draw）→ 箭头（关混合，1 draw）
   - `NodeBatchRenderer.render`：拼 14 路 instance 数组（bufferSubData 增量上传，动态 buffer 复用）→ 图标纹理绑定 → `drawArraysInstanced`（1 draw）
   - `TextLabelRenderer`：`buildNodeLabels/buildLinkLabels` → 逐字符 instanced（2 draw）
   - 同步 `plugin.tx/ty/k` → `PlusBadgeLayer`（overlay）renderPickBuffer + render（2 draw）
4. **拾取**：pointer 事件 → `WebGLPicker.pick`（FBO 重绘 2 draw + readPixels）或 `CpuPicker.pick`（纯 CPU）。
每帧共约 6 次 draw call（不拾取时）。

## 5. 事件体系（GraphEvents，`events.ts`）
**发布者 → 事件 → 订阅者**：
- `GraphModel.updateGraphData` → `dataChange` ← GraphView.rebuildFromModel
- `StateManager`（全部变更方法）→ `highlightChange/selectionChange/hiddenChange/rootNodesChange/nodesHoverChange/linksHoverChange/metaDataChange` ← GraphView（selectionChange/hiddenChange→syncAll*Styles）
- `LoadingManagerModel` → `loadingChange`（以 `as any` 发布，未列入 `GraphEventMap`）
- `TagManagerModel` → `tagChange`（add/update/remove/clear 载荷）
- `GraphView.setupRendererCallbacks`（来自 InteractionManager 拾取/手势）→ `nodeClick/nodeRightClick/nodeHover/linkHover/nodeDragEnd/linkClick/backgroundClick/zoom/plusToolClick`（`menuOpen`、`framePost`、`loadMore` 在 `GraphEventMap` 中定义但 graph/src 内无发布者，供外部订阅/发布）
**GraphEvents API**：`subscribe(type,fn)→unsubscribe`、`publish(type,data)`（逐订阅者 try/catch）、`unsubscribeAll/clear/getSubscriberCount/getSubscribedEvents/hasSubscribers`；`GraphEventMap` 泛型化全部事件载荷。

## 6. 关键文件索引
`client/view-new.ts`(GraphView) · `model.ts` · `events.ts` · `state-manager.ts` · `tag-manager.ts` · `loading-manager.ts` · `style-manager.ts` · `theme.ts` · `renderer/`(graph-renderer/webgl-renderer/default-render-plugin/node-batch/link-batch/text-label/plus-badge-layer/icon-atlas/atlas/webgl-picker/cpu-picker/interaction-manager/camera/picker/render-plugin/graph-overlay/node-pipeline/shaders) · `physics/`(layout/simulation/tree-layout) · `entity/`(common/default/link/default) · `expansion/expansion-service.ts`(纯类型) · vendor/ 为 d3-force/d3-quadtree/d3-timer/d3-dispatch 源码转手（ForceSimulation 直接消费）。

> 核实备注：`loadingChange` 以 as any 发布且未列入 GraphEventMap；`menuOpen/framePost/loadMore` 仅事件表声明、graph/src 内无发布者；`style-manager.ts` 方法名拼写 `updategGraphModelData`（源码原样）；EntityRegistry/LinkRegistry（Canvas2D 时代）与 RenderPlugin（WebGL 时代）两套扩展面并存，新视图只走后者。
