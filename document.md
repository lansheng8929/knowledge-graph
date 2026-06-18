# @ra-sdk/knowledge-graph — 使用手册

## 一、快速开始

```bash
npm install @ra-sdk/knowledge-graph
```

```ts
import { ConnGraphModel, ConnGraphView } from "@ra-sdk/knowledge-graph"

// 1. 创建数据模型
const model = new ConnGraphModel({
  initData: {
    graphData: {
      nodes: [...],
      links: [...],
    },
  },
})

// 2. 创建视图（Canvas 模式）
const view = new ConnGraphView({
  container: document.getElementById("graph"),
  graphModel: model,
})

// 3. 创建视图（GPU 模式，需要 WebGL 支持）
const view = new ConnGraphView({
  container: document.getElementById("graph"),
  graphModel: model,
  renderer: "gpu",
})
```

---

## 二、数据模型 (`ConnGraphModel`)

### 2.1 节点数据格式

```ts
interface GraphNode {
  id: string // 唯一标识（必填）
  x?: number // X 坐标
  y?: number // Y 坐标
  fx?: number // 固定 X（拖拽后固定位置）
  fy?: number // 固定 Y
  data?: GraphNodeInfo // 附加信息
}

interface GraphNodeInfo {
  nodeType?: string // 节点类型（用于样式和渲染器选择）
  stateType?: string // 节点状态
  label?: string // 显示标签
  pageIndex?: number // 分页索引
  count?: number // 已加载邻居数
  total?: number // 邻居总数
  [key: string]: any // 业务自定义字段
}
```

### 2.2 边数据格式

```ts
interface GraphLink {
  id: string // 唯一标识
  source: string | GraphNode // 源节点 ID 或对象
  target: string | GraphNode // 目标节点 ID 或对象
  ranking?: number // 排序权重
  data?: GraphLinkInfo // 附加信息
}

interface GraphLinkInfo {
  label?: string // 显示标签
  linkType?: string // 边类型
  stateType?: string // 边状态
  color?: string // 颜色
  lineWidth?: number // 线宽
  [key: string]: any // 业务自定义字段
}
```

### 2.3 模型 API

| 方法                             | 说明             |
| -------------------------------- | ---------------- |
| `updateGraphData({ graphData })` | 全量替换图数据   |
| `getGraphModelData()`            | 获取当前数据快照 |
| `getNodeById(id)`                | 按 ID 查找节点   |
| `getLinkById(id)`                | 按 ID 查找边     |

### 2.4 状态管理 (`stateManager`)

```ts
model.stateManager.setSelectedNodes(["node-1"])
model.stateManager.setFocusNodes(["node-2"])
model.stateManager.setHiddenNodes(["node-3"])
model.stateManager.setHoveredNodes(["node-4"])
model.stateManager.clearSelection()
model.stateManager.showAll()
```

### 2.5 事件系统 (`events`)

```ts
model.events.subscribe("nodeClick", (node) => {
  console.log("Clicked:", node)
})

model.events.subscribe("linkClick", (link) => {
  console.log("Link clicked:", link)
})

model.events.subscribe("backgroundClick", () => {
  console.log("Background clicked")
})
```

**全部事件类型：**

| 事件              | 数据                          | 说明         |
| ----------------- | ----------------------------- | ------------ |
| `nodeClick`       | `GraphNode \| null`           | 节点点击     |
| `nodeRightClick`  | `{ node, screenPos, event }`  | 节点右键     |
| `nodeHover`       | `GraphNode \| null`           | 节点悬停     |
| `nodeDragEnd`     | `GraphNode`                   | 节点拖拽结束 |
| `linkClick`       | `GraphLink \| null`           | 边点击       |
| `linkRightClick`  | `{ link, screenPos, event }`  | 边右键       |
| `linkHover`       | `{ link, previousLink }`      | 边悬停       |
| `backgroundClick` | `void`                        | 空白区域点击 |
| `zoom`            | `{ k, x, y }`                 | 缩放平移     |
| `dataChange`      | `{ graphData }`               | 数据变更     |
| `framePost`       | `{ ctx, globalScale, cache }` | 每帧绘制后   |

---

## 三、视图 (`ConnGraphView`)

### 3.1 构造函数选项

```ts
interface GraphViewOptions {
  container: HTMLElement // 挂载容器（必填）
  graphModel: ConnGraphModel // 数据模型（必填）
  width?: number // 画布宽度
  height?: number // 画布高度
  backgroundColor?: string // 背景色
  arrowDisplay?: boolean // 是否显示箭头
  debug?: boolean // 调试模式
  style?: CustomGraphViewStyle // 自定义样式
  renderer?: "canvas" | "gpu" // 渲染引擎（默认 canvas）
  entityRegistry?: EntityRegistry // 节点实体注册器
  setupD3Force?: Function // D3 力配置（仅 canvas 模式）
}
```

### 3.2 视图 API

| 方法                           | 说明                             |
| ------------------------------ | -------------------------------- |
| `resize(width, height)`        | 调整画布尺寸（兼容两种模式）     |
| `fitView(duration?, padding?)` | 自适应视图                       |
| `focusNodeById(nodeId)`        | 聚焦节点                         |
| `updateModel(data)`            | 更新模型数据                     |
| `updateStyle({ style })`       | 更新样式                         |
| `updateD3Force(fn)`            | 更新 D3 力配置（仅 canvas 模式） |

### 3.3 GPU 模式注意事项

GPU 模式使用 `@cosmograph/cosmograph`（WebGL），性能和渲染效果优于 Canvas，但有以下差异：

| 功能           | Canvas                 | GPU                               |
| -------------- | ---------------------- | --------------------------------- |
| 自定义节点渲染 | `EntityRenderer`       | 数据驱动（color/size/label 字段） |
| 点击检测       | `canvas-color-tracker` | Cosmograph 内置                   |
| 拖拽节点       | force-graph 内置       | Cosmograph 内置                   |
| 力布局         | D3                     | Cosmograph 内置                   |
| 标签           | Canvas 绘制            | Cosmograph HTML 标签层            |
| 连线标签       | Canvas 绘制            | `customLabels` API                |

---

## 四、React 集成 (`GraphProvider` + `useGraph`)

一站式 React Context，统一管理模型、视图、所有管理器、以及事件订阅。

### 4.1 基本用法

```tsx
import { GraphProvider, useGraph } from "@ra-sdk/knowledge-graph/graph/client"

function App() {
  return (
    <GraphProvider
      options={{
        initData: {
          graphData: { nodes: [...], links: [...] },
        },
      }}
      eventHandlers={{
        onNodeClick: (node) => console.log("clicked", node),
        onLinkClick: (link) => console.log("link", link),
        onBackgroundClick: () => console.log("bg"),
      }}
    >
      <GraphCanvas />
      <SidePanel />
    </GraphProvider>
  )
}

// 任意子组件中使用
function SidePanel() {
  const {
    model,           // ConnGraphModel
    graphData,       // 当前图数据（实时）

    stateManager,    // focus/select/hide/hover
    tagManager,      // 标签
    loadingManager,  // 加载状态
    styleManager,    // 运行时样式

    metadataManager, // 分页/规则元数据
    historyManager,  // 撤销/重做
    styleRegistry,   // 样式注册
    entityRegistry,  // 节点注册器
    linkRegistry,    // 边注册器

    setEventHandlers, // 动态更新事件处理器
  } = useGraph()

  return <div>{/* ... */}</div>
}
```

### 4.2 `GraphProvider` Props

| Prop              | 类型                            | 说明                              |
| ----------------- | ------------------------------- | --------------------------------- |
| `options`         | `Options<G>`                    | 模型初始化参数（至少 `initData`） |
| `model?`          | `ConnGraphModel<G>`             | 可外部传入已有模型实例            |
| `eventHandlers?`  | `GraphEventHandlers<G>`         | 统一事件处理器，自动订阅/取消     |
| `historyOptions?` | `{ initialHistory?, maxSize? }` | 历史管理器配置                    |
| `children`        | `ReactNode`                     | 子组件                            |

### 4.3 `useGraph()` 返回值

| 属性               | 类型                | 说明                        |
| ------------------ | ------------------- | --------------------------- |
| `model`            | `ConnGraphModel<G>` | 数据模型                    |
| `graphData`        | `{ nodes, links }`  | 当前图数据                  |
| `graphDataRef`     | `RefObject`         | 图数据 Ref（始终最新）      |
| `stateManager`     | `StateManager<G>`   | 状态（选中/聚焦/隐藏/悬停） |
| `tagManager`       | `TagManager<G>`     | 标签管理                    |
| `loadingManager`   | `LoadingManager`    | 节点加载状态                |
| `styleManager`     | `StyleManager<G>`   | 单实例运行时样式            |
| `metadataManager`  | `MetadataManager`   | 分页/拓展规则元数据 ⭐      |
| `historyManager`   | `HistoryManager`    | 撤销/重做 ⭐                |
| `styleRegistry`    | `StyleRegistry<G>`  | 节点+边样式批量注册 ⭐      |
| `entityRegistry`   | `EntityRegistry<G>` | 节点渲染器注册              |
| `linkRegistry`     | `LinkRegistry<G>`   | 边渲染器注册 ⭐             |
| `setEventHandlers` | `(h) => void`       | 动态设置事件处理器          |

---

## 五、实体注册器 (`EntityRegistry`)

用于注册不同节点类型的 Canvas 渲染器。

```ts
import {
  EntityRegistry,
  EntityCreator,
} from "@ra-sdk/knowledge-graph/graph/client"

const registry = new EntityRegistry()

// 注册单个类型
registry.register("default", () => ({
  renderNodeCanvasObject: ({ node, ctx, globalScale, style }) => {
    // 绘制节点
  },
  renderNodePointerArea: ({ node, indexColor, ctx, style }) => {
    // 绘制点击检测区域
  },
  getCollisionRadius: ({ node, style }) => {
    return style.radius ?? 4
  },
}))

// 批量注册
registry.registerBatch({
  phone: createPhoneRenderer,
  email: createEmailRenderer,
})
```

**`EntityRenderer` 接口：**

| 方法                         | 用途                                      |
| ---------------------------- | ----------------------------------------- |
| `renderNodeCanvasObject`     | 渲染节点图形                              |
| `renderNodePointerArea`      | 渲染点击/悬停检测区（用 indexColor 填充） |
| `renderNodeToolsPointerArea` | 渲染工具按钮检测区                        |
| `getCollisionRadius`         | 返回碰撞检测半径                          |

**Canvas 绘制工具 (`makeDrawWrapper`)：**

```ts
import { makeDrawWrapper } from "@ra-sdk/knowledge-graph/graph/client"

makeDrawWrapper(ctx)
  .circle(x, y, radius, color, opacity) // 画圆
  .stroke(x, y, radius, color, width) // 画边框
  .text(text, x, y, size, color, opacity) // 画文字
  .multiColorText(segments, x, y) // 画多色文字
  .drawImg(cache, src, x, y, w, h, opacity) // 画图标
  .textWrap(text, x, y, size, color, op, maxW) // 画自动换行文字
  .spinner(x, y, radius, opacity) // 画加载转圈
  .drawPlusTool(color, x, y, radius, scale) // 画展开按钮(+)
  .drawPlusToolArea(indexColor, x, y, radius, scale) // 展开按钮点击检测区
```

### 5.1 自定义节点渲染实战模式

实际项目中，Canvas 自定义节点渲染通常采用 **三层架构**：

| 层次           | 文件                                     | 职责                                                        |
| -------------- | ---------------------------------------- | ----------------------------------------------------------- |
| **具体实体层** | `<entity>/<name>.client.ts`              | 定义每个实体类型的专属渲染（图标、主标签文本）              |
| **公共装饰层** | `common.ts`                              | 通用渲染逻辑：光晕、涉案/锁定图标、加载动画、标签、展开按钮 |
| **注册层**     | `entity-registry.ts` / `index.client.ts` | 注册所有实体到 registry                                     |

#### ① 具体实体层 (`<entity>.client.ts`)

每个实体类型创建一个 creator 工厂，通过 `NetworkAnalysisEntityCreator` 类型约束：

```ts
import { makeDrawWrapper } from "../../network-analysis-draw-ctx"
import { getPaginator } from "../../network-analysis-utils"
import { NetworkAnalysisEntityCreator } from "../../network-analysis-entity-registry"

import type { ClueNodeType } from "./clue.type"

export const createClueEntity: NetworkAnalysisEntityCreator =
  ({ documentKinds }) =>
  () => {
    const imageCache = new Map<string, HTMLImageElement>()

    return {
      renderNodeCanvasObject: ({ node, ctx, globalScale, style }) => {
        const { x = 0, y = 0 } = node
        // 从 node.data 解构业务字段作为标签文字
        const { count, total, name } = (node.data as ClueNodeType["data"]) ?? {}

        const iconPath = `/api/v1/connValueType-icon?key=clue`

        const {
          radius,
          fontSize,
          bgColor,
          textColor,
          strokeColor,
          strokeWidth,
          opacity,
        } = style

        // 三步绘制：背景圆 → 边框 → 图标
        makeDrawWrapper(ctx)
          .circle(x, y, radius, bgColor, opacity)
          .stroke(x, y, radius, strokeColor, strokeWidth, opacity)
          .drawImg(imageCache, iconPath, x, y, radius, radius, opacity)

        // 缩放足够时渲染标签文字
        if (globalScale > DEFAULT_NODE_LABEL_SCALE_THRESHOLD) {
          const paginator = getPaginator(node.data, style) // "1/5" 分页信息

          makeDrawWrapper(ctx).multiColorText(
            [
              { text: name || "", fontSize, color: textColor }, // 主标签
              ...paginator, // 分页副标签
            ],
            x,
            y + radius + fontSize,
          )
        }
      },

      renderNodePointerArea: ({ node, indexColor, ctx, style }) => {
        const { x = 0, y = 0 } = node
        makeDrawWrapper(ctx)
          .stroke(x, y, radius, strokeColor, strokeWidth)
          .circle(x, y, radius, indexColor)
      },

      getCollisionRadius: ({ node, style }) => style.radius ?? 4,
    }
  }
```

**关键点：**

- imageCache 在闭包中缓存，避免重复加载图片
- 从 `node.data` 解构业务字段（如 `name`、`type`）作为节点标签
- `getPaginator(node.data, style)` 生成分页标签（如 `"1/5"`）
- `renderNodePointerArea` 用 `indexColor` 填充，供点击检测使用

#### ② 公共装饰层 (`common.ts`)

通过 `createEntity()` 包装函数，将公共渲染逻辑注入每个实体：

```ts
import {
  EntityCreator,
  EntityRenderer,
} from "@ra-sdk/knowledge-graph/graph/client"

export const createEntity = (
  entityCreator: EntityCreator<NetworkAnalysisGenerics>,
): EntityRenderer<NetworkAnalysisGenerics> => {
  const imageCache = new Map<string, HTMLImageElement>()
  const entityInstance = entityCreator()

  return {
    renderNodeCanvasObject(props) {
      const newprops = propsDecorator.renderNodeCanvasObject(props)
      entityCommonRenderer.beforeRenderNodeCanvasObject?.(newprops)
      entityInstance.renderNodeCanvasObject(newprops) // 调用具体实体的渲染
      entityCommonRenderer.afterRenderNodeCanvasObject?.(newprops, imageCache)
      entityCommonRenderer.renderNodeTools?.(newprops)
    },
    renderNodePointerArea(props) {
      const newprops = propsDecorator.renderNodePointerArea(props)
      entityInstance.renderNodePointerArea(newprops)
    },
    renderNodeToolsPointerArea(props) {
      /* ... */
    },
    getCollisionRadius(props) {
      return entityInstance.getCollisionRadius(
        propsDecorator.getCollisionRadius(props),
      )
    },
  }
}
```

**`entityCommonRenderer` 各阶段职责：**

| 阶段     | 方法                           | 渲染内容                                                            |
| -------- | ------------------------------ | ------------------------------------------------------------------- |
| 绘制前   | `beforeRenderNodeCanvasObject` | 光晕 (`light` 字段)                                                 |
| 绘制后   | `afterRenderNodeCanvasObject`  | 涉案标记(`isInvolveEvid`)、锁定图标(`isOpened`)、加载转圈、备注标签 |
| 工具按钮 | `renderNodeTools`              | 展开按钮(「+」, 当 `count < total` 时)                              |

**`propsDecorator` — Props 预处理：**

在调用渲染方法前统一调整节点属性，例如根据 `caseWidget`（案件权重）动态调整半径：

```ts
export const propsDecorator = {
  renderNodeCanvasObject: (props) => {
    props.style.radius = computeRadiusWithWeight(
      props.style.radius,
      props.node.data?.caseWidget,
    )
    return props
  },
  // renderNodePointerArea, getCollisionRadius ... 同理
}
```

#### ③ 注册层 (`entity-registry.ts`)

将装饰后的实体注册到 `EntityRegistry`：

```ts
import { EntityRegistry } from "@ra-sdk/knowledge-graph/graph/client"
import { createEntity } from "./common" // 公共装饰层
import { createClueEntity } from "./clue/clue.client" // 具体实体层

const registry = new EntityRegistry()

// 用 createEntity 包装后注册
registry.register("clue", createEntity(createClueEntity({ documentKinds })))
registry.register("phone", createEntity(createPhoneEntity({ documentKinds })))
```

---

## 六、边注册器 (`LinkRegistry`) ⭐

镜像 `EntityRegistry`，用于注册不同边类型的渲染器。

```ts
import { LinkRegistry } from "@ra-sdk/knowledge-graph/graph/client"

const registry = new LinkRegistry()

registry.register("default", () => ({
  renderLinkCanvasObject: ({ ctx, style, startX, startY, endX, endY }) => {
    ctx.strokeStyle = style.color ?? "#999"
    ctx.lineWidth = (style as any).lineWidth ?? 1
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
  },
  renderLinkPointerArea: ({ ctx, indexColor, startX, startY, endX, endY }) => {
    // 渲染点击检测区
  },
  getLinkWidth: ({ style }) => (style as any).lineWidth ?? 1,
}))
```

**`LinkRenderer` 接口：**

| 方法                     | 用途           |
| ------------------------ | -------------- |
| `renderLinkCanvasObject` | 渲染边线       |
| `renderLinkPointerArea`  | 渲染点击检测区 |
| `getLinkWidth`           | 返回线宽       |

---

## 七、样式系统

### 6.1 节点样式 (`NodeStyle`)

```ts
import type { NodeStyle } from "@ra-sdk/knowledge-graph"

const style: NodeStyle<MyGenerics> = {
  regular: {
    bgColor: "#2ed573", // 填充色
    strokeColor: "#26a65b", // 边框色
    strokeWidth: 0.2, // 边框宽度
    textColor: "#000", // 文字色
    radius: 4, // 半径
    fontSize: 2, // 字号
    opacity: 1, // 透明度
    light: "#ff0", // 光晕色
  },
  highlighted: {
    /* 高亮 */
  },
  selected: {
    /* 选中 */
  },
  hovered: {
    /* 悬停 */
  },
  hidden: {
    /* 隐藏 */
  },
  root: {
    /* 根节点 */
  },
}
```

### 6.2 边样式 (`LinkStyle`)

```ts
import type { LinkStyle } from "@ra-sdk/knowledge-graph"

const style: LinkStyle<MyGenerics> = {
  regular: { color: "#999", opacity: 1 },
  highlighted: { color: "#ff0", light: "#ff0" },
  selected: { color: "#357abd", light: "#357abd" },
  hovered: { color: "#0cf", light: "#0cf" },
  hidden: { color: "#999", opacity: 0.3 },
}
```

### 6.3 样式注册器 (`StyleRegistry`)

批量管理节点和边的样式：

```ts
import { StyleRegistry } from "@ra-sdk/knowledge-graph"

const registry = new StyleRegistry<MyGenerics>()
  .registerNodeStyle("phone", phoneNodeStyle)
  .registerLinkStyle("access", accessLinkStyle)
  .registerOtherStyle({ background: "#f6f6f6" })

const viewStyle = registry.build()
```

### 6.4 样式管理器 (`StyleManager`)

运行时动态管理单实例样式（优先级高于 `GraphViewStyle`）：

```ts
model.styleManager.setNodeStyle("node-1", {
  bgColor: "#ff0000",
})
model.styleManager.setLinkStyle("link-1", {
  color: "#00ff00",
})
```

---

## 八、扩展工具

### 7.1 元数据管理器 (`MetadataManager`)

存储节点/边的分页信息和拓展规则：

```ts
import { MetadataManager } from "@ra-sdk/knowledge-graph"

const meta = new MetadataManager()

meta.setMeta(
  { id: "node-1", type: "node" },
  {
    pageIndex: 2,
    total: 50,
    count: 20,
    rules: [{ type: "expand", limit: 10 }],
  },
)

const pagination = meta.getPagination({ id: "node-1", type: "node" })
```

### 7.2 历史管理器 (`HistoryManager`)

撤销/重做图谱操作：

```ts
import { HistoryManager } from "@ra-sdk/knowledge-graph"

const history = new HistoryManager({ maxSize: 50 })

// 保存状态
history.pushState({
  type: "expand",
  description: "展开节点 node-1",
  state: { graphData: currentData },
})

// 撤销
if (history.canGoBack) {
  const prev = history.goBack()
}

// 重做
if (history.canGoForward) {
  const next = history.goForward()
}
```

### 7.3 图数据更新器 (`createGraphDataUpdater`)

链式 API 操作图数据：

```ts
import { createGraphDataUpdater } from "@ra-sdk/knowledge-graph/graph/client"

const updated = createGraphDataUpdater(model)
  .fixNodePosition("node-1")
  .merge(newNodesAndLinks)
  .recalculateNodeCounts()
  .when(someCondition, (u) => u.incrementNodePageIndex("node-2"))
  .build()

model.updateGraphData(updated)
```

**可用操作：**

| 方法                         | 说明                     |
| ---------------------------- | ------------------------ |
| `fixNodePosition(id)`        | 固定节点位置             |
| `releaseNodePosition(id)`    | 释放节点（允许自由移动） |
| `setNodeLoading(id, bool)`   | 设置加载状态             |
| `incrementNodePageIndex(id)` | 递增分页索引             |
| `incrementNodeCount(id, n)`  | 递增邻居计数             |
| `recalculateNodeCounts()`    | 重新计算所有节点邻居数   |
| `merge(newData)`             | 去重合并新数据           |
| `replace(newData)`           | 全量替换数据             |
| `when(cond, fn)`             | 条件分支                 |
| `update(fn)`                 | 自定义更新回调           |
| `build()`                    | 返回最终数据             |

### 7.4 可拖拽面板 (`ResizeLayout`)

```tsx
import { ResizeLayout } from "@ra-sdk/knowledge-graph/graph/client"

;<ResizeLayout
  position="left" // "left" | "right"
  open={isOpen}
  onOpenChange={setIsOpen}
  initWidth={300}
  minWidth={200}
  maxWidth={400}
>
  <YourPanelContent />
</ResizeLayout>
```

---

## 九、GPU 渲染器 (`CosmographRenderer`)

直接使用 WebGL 加速渲染，可替换默认 Canvas 渲染。

### 8.1 基本用法

```ts
import { CosmographRenderer } from "@ra-sdk/knowledge-graph/graph/client"

const renderer = new CosmographRenderer({
  container: document.getElementById("graph")!,
  graphModel: model,
  arrowDisplay: true,
  debug: false,
  extraCosmographConfig: {
    // 任何 CosmographConfig 选项
    pointDefaultSize: 6,
    simulationRepulsion: 1.5,
  },
})

await renderer.init()
```

### 8.2 节点样式（数据驱动）

GPU 模式下样式由数据的 `color`、`size`、`label` 字段驱动：

```ts
model.updateGraphData({
  graphData: {
    nodes: [
      {
        id: "n1",
        data: {
          label: "节点1",
          color: "#ff0000",  // → 节点颜色
          size: 8,           // → 节点大小
        },
      },
    ],
    links: [...],
  },
})
```

### 8.3 连线标签

```ts
const labels = new Map<number, string>()
labels.set(0, "关系A")
labels.set(1, "关系B")
renderer.setLinkLabels(labels)

// 清除
renderer.clearLinkLabels()
```

### 8.4 聚焦和视图控制

```ts
renderer.focusNode("node-123") // 聚焦节点
renderer.fitView(500, 0.1) // 自适应视图
renderer.destroy() // 销毁
```

---

## 十、完整类型定义一览

### 9.1 基础类型

```ts
export type NodeState =
  | "regular"
  | "root"
  | "highlighted"
  | "selected"
  | "hidden"
  | "hovered"
export type LinkState =
  | "regular"
  | "highlighted"
  | "selected"
  | "hidden"
  | "hovered"
export type NodeId = string
export type LinkId = string
```

### 9.2 泛型参数

```ts
interface GraphDataGenerics {
  NO: object // 节点数据扩展字段
  NT: string // 节点类型枚举
  NS: string // 节点状态枚举
  LO: object // 边数据扩展字段
  LT: string // 边类型枚举
  LS: string // 边状态枚举
  M: object // 标签元数据类型
}
```

---

## 十一、目录结构

```
@ra-sdk/knowledge-graph/
├── graph/
│   ├── model.ts              # ConnGraphModel 数据模型
│   ├── events.ts             # ConnGraphEvents 事件系统
│   ├── state-manager.ts      # StateManager 状态管理
│   ├── style-manager.ts      # StyleManager 运行时样式
│   ├── style-registry.ts     # StyleRegistry 样式注册器 ⭐
│   ├── meta-manager.ts       # MetadataManager 元数据管理 ⭐
│   ├── history-manager.ts    # HistoryManager 撤销/重做 ⭐
│   ├── theme.ts              # 主题和默认样式
│   ├── tag-manager.ts        # 标签管理
│   ├── loading-manager.ts    # 加载状态管理
│   ├── type.ts               # 基础类型定义
│   ├── utils.ts              # 工具函数
│   ├── constants.ts          # 默认常量
│   ├── image-cache.ts        # 图片缓存
│   ├── entity/               # 内置实体（default）
│   └── client/
│       ├── view.ts           # ConnGraphView Canvas 视图
│       ├── type.ts           # 客户端类型（GraphNode, GraphLink...）
│       ├── entity-registry.ts # EntityRegistry 节点注册器
│       ├── entity-types.ts   # EntityRenderer 接口
│       ├── link-registry.ts  # LinkRegistry 边注册器 ⭐
│       ├── link-types.ts     # LinkRenderer 接口 ⭐
│       ├── cosmograph-renderer.ts # GPU 渲染器 ⭐
│       ├── graph-data-updater.ts  # 链式数据更新器 ⭐
│       ├── resize-layout.tsx      # 可拖拽面板 ⭐
│       ├── graph-context.tsx      # GraphProvider + useGraph ⭐
│       ├── minimap.tsx            # 小地图
│       ├── shadow-layer.ts        # 阴影层管理
│       ├── tooltip.tsx            # 提示框
│       ├── utils.ts               # 客户端工具（makeDrawWrapper）
│       └── constants.ts           # 客户端常量
└── package.json
```

⭐ = 本次新增
