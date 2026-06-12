# @ra-sdk/knowledge-graph — 实体（节点）与边定义指南

## 目录结构

### 节点（Node）定义

每个节点类型独占一个文件夹，放在 `entity/` 下：

```
entity/phone/               ← 节点类型名称
├── phone.type.ts           ← ① 节点数据类型定义
├── phone.meta.ts           ← ② 元数据（显示名、属性列表、颜色）
├── phone.style.ts          ← ③ 样式（各状态下的颜色、大小、透明度）
├── phone.client.ts         ← ④ 客户端渲染器（Canvas 绘制）
├── right-panel.tsx         ← ⑤ 右侧详情面板
└── index.ts                ← 统一导出
```

### 边（Link）定义

```
links/access/
├── access.type.ts          ← ① 边数据类型定义
├── access.meta.ts          ← ② 元数据
├── access.style.ts         ← ③ 样式
├── right-panel.tsx         ← ④ 右侧详情面板
└── index.ts
```

---

## 一、定义节点类型

### 1. `.type.ts` — 数据类型

定义节点携带的业务数据字段：

```ts
// entity/phone/phone.type.ts
import { NetWorkAnalysisGraphNode } from "../../network-analysis-type";

export type PhoneNodeType = NetWorkAnalysisGraphNode<{
  phone?: string;               // 手机号
  name?: string;                // 姓名
  actionList?: {                // 行为列表
    type: string;
    times: string[];
  }[];
}>;
```

### 2. `.meta.ts` — 元数据

定义节点在面板、菜单中的展示信息：

```ts
// entity/phone/phone.meta.ts
import type { NodeType } from "../../network-analysis-type";

export const phoneMeta = {
  key: "phone" as NodeType,                         // 节点类型标识（与后端一致）
  i18nKey: "networkAnalysis.nodeType.phone",        // 国际化 key
  icon: "phone",                                    // 图标标识
  color: "#10b981",                                 // 默认颜色
  description: "手机号节点，表示一个手机号码实体",    // 描述
  properties: {                                     // 属性列表（用于约束编辑器等）
    phone: { key: "phone_no", label: "电话号码" },
    name:  { key: "name",     label: "姓名" },
  },
} as const;

export type PhoneMeta = typeof phoneMeta;
```

然后在 `entity/metadata.ts` 的 `getNodeMetadataMap` 中注册：

```ts
phone: mataWapper(Entity.phoneMeta),
```

### 3. `.style.ts` — 样式

定义节点在各个状态下的 Canvas 绘制样式：

```ts
// entity/phone/phone.style.ts
import { NodeStyle } from "@ra-sdk/knowledge-graph";
import { NetworkAnalysisGenerics } from "../../network-analysis-type";

export const phoneNodeStyle: NodeStyle<NetworkAnalysisGenerics> = {
  regular: {                              // 默认状态
    bgColor: "#2ed573",
    strokeColor: "#26a65b",
    textColor: "#000",
    radius: 4,
    strokeWidth: 0.2,
  },
  highlighted: {                          // 高亮（focus 时）
    bgColor: "#2ed573",
    strokeColor: "#0066ff",
    strokeWidth: 3,
  },
  selected: {                             // 选中
    bgColor: "#ff8c00",
    strokeColor: "#e67e00",
    strokeWidth: 4,
  },
  hovered: {                              // 鼠标悬停
    bgColor: "#45e08a",
    opacity: 1,
  },
  hidden: { opacity: 0.3 },              // 隐藏
  root: { light: "#e67e00" },            // 根节点光晕
};
```

**可用样式字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `bgColor` | `string` | 填充颜色 |
| `strokeColor` | `string` | 边框颜色 |
| `strokeWidth` | `number` | 边框宽度 |
| `textColor` | `string` | 文字颜色 |
| `radius` | `number` | 节点半径 |
| `fontSize` | `number` | 文字大小 |
| `opacity` | `number` | 透明度 |
| `light` | `string` | 光晕颜色 |
| `tagColor` | `string` | 标签颜色 |

然后在 `styleManager` 初始化时注册样式。可参考 `network-analysis-style.ts` 中的 `nodeStyleMap`：

```ts
phone: Entity.phoneNodeStyle,
```

### 4. `.client.ts` — Canvas 渲染器（核心）

实现 `EntityRenderer` 接口的三个方法：

```ts
// entity/phone/phone.client.ts
import { EntityCreator } from "@ra-sdk/knowledge-graph/graph/client";
import { makeDrawWrapper } from "../../network-analysis-draw-ctx";
import { getPaginator } from "../../network-analysis-utils";
import { DEFAULT_NODE_LABEL_SCALE_THRESHOLD } from "../../network-analysis-constants";
import { NetworkAnalysisEntityCreator } from "../../network-analysis-entity-registry";
import type { PhoneNodeType } from "./phone.type";

export const createPhoneEntity: NetworkAnalysisEntityCreator =
  ({ documentKinds }) =>
  () => {
    const imageCache = new Map<string, HTMLImageElement>();

    return {
      // ── 绘制节点 ──
      renderNodeCanvasObject: ({ node, ctx, globalScale, style }) => {
        const { x = 0, y = 0 } = node;
        const { phone, count, total } = (node.data as PhoneNodeType["data"]) ?? {};
        const iconPath = `/api/v1/connValueType-icon?key=phone`;
        const { radius, fontSize, bgColor, textColor, strokeColor, strokeWidth, opacity } = style;

        // 1. 画圆
        makeDrawWrapper(ctx)
          .circle(x, y, radius, bgColor, opacity)
          .stroke(x, y, radius, strokeColor, strokeWidth, opacity)
          .drawImg(imageCache, iconPath, x, y, radius, radius, opacity);

        // 2. 画文字（仅在缩放足够大时）
        if (globalScale > DEFAULT_NODE_LABEL_SCALE_THRESHOLD) {
          const paginator = getPaginator(node.data, style);
          makeDrawWrapper(ctx)
            .multiColorText([
              { text: phone || "", fontSize, color: textColor },
              ...paginator,
            ], x, y + radius + fontSize)
            .text(
              "手机号",
              x,
              y + radius + (fontSize + 0.5) * 2,
              fontSize,
              textColor,
              opacity,
            );
        }
      },

      // ── 绘制点击区域 ──
      renderNodePointerArea: ({ node, indexColor, ctx, style }) => {
        const { x = 0, y = 0 } = node;
        const { strokeColor, strokeWidth, radius } = style;
        makeDrawWrapper(ctx)
          .stroke(x, y, radius, strokeColor, strokeWidth)
          .circle(x, y, radius, indexColor);
      },

      // ── 碰撞半径（用于力布局） ──
      getCollisionRadius: ({ node, style }) => {
        const { radius } = style;
        return radius;
      },
    };
  };
```

**注意**：渲染器函数签名由 `entity/common.ts` 中的 `createEntity` 包装器自动包裹。该包装器会自动注入**光晕绘制**、**加载动画**、**标签渲染**等通用逻辑。你只需关注节点本身的绘制（圆形、图标、文字）。

### 5. 注册新实体

**步骤 1** — 在 `entity/index.client.ts` 中导出创建器：

```ts
export { createPhoneEntity } from "./phone/phone.client";
```

**步骤 2** — 在 `network-analysis-entity-registry.ts` 的 `getEntityCreators` 映射表中注册：

```ts
phone: Entity.createPhoneEntity(props),
```

**步骤 3** — 在 `entity/index.ts` 中导出类型和样式供其他地方使用：

```ts
export * from "./phone";
```

---

## 二、定义边类型

### 1. `.type.ts`

```ts
// links/access/access.type.ts
import {
  DateTimeData,
  NetWorkAnalysisGraphLink,
} from "../../network-analysis-type";

export type AccessLinkType = NetWorkAnalysisGraphLink<{
  action?: string;
  eventTime?: DateTimeData;
  type?: string;
  accType?: string;
  accountNo?: string;
}>;
```

### 2. `.meta.ts`

```ts
// links/access/access.meta.ts
import type { LinkType } from "../../network-analysis-type";

export const accessMeta = {
  key: "access" as LinkType,
  i18nKey: "networkAnalysis.linkType.access",
  description: "访问关系",
  properties: {
    action:    { key: "action",    label: "动作" },
    eventTime: { key: "eventTime", label: "事件时间" },
    accType:   { key: "accType",   label: "访问类型" },
    accountNo: { key: "accountNo", label: "账号" },
  },
};
```

然后在 `links/metadata.ts` 的 `linkMetadataMap` 中注册：

```ts
access: Links.accessMeta,
```

### 3. `.style.ts`

```ts
// links/access/access.style.ts
import { LinkStyle } from "@ra-sdk/knowledge-graph";
import { NetworkAnalysisGenerics } from "../../network-analysis-type";

export const accessLinkStyle: LinkStyle<NetworkAnalysisGenerics> = {
  regular:     { color: "#9ca3af", opacity: 1 },
  highlighted: { color: "#ffff00", light: "#ffff00", opacity: 1 },
  selected:    { color: "#357abd", light: "#357abd", opacity: 1 },
  hidden:      { color: "#9ca3af", opacity: 0.3 },
  hovered:     { color: "#00ccff", light: "#00ccff" },
};
```

**可用样式字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `color` | `string` | 线条颜色 |
| `opacity` | `number` | 透明度 |
| `light` | `string` | 光晕颜色 |
| `label` | `string` | 标签文字 |
| `lineWidth` | `number` | 线宽 |

### 4. 注册边

**步骤 1** — 在 `links/index.ts` 中导出：

```ts
export * from "./access";
```

**步骤 2** — 在 `network-analysis-map.server.ts` 的 `edgeProcessorMap` 中添加数据处理逻辑（边数据从后端 API 返回的原始数据中提取字段）：

```ts
access: (edgeData) => ({
  id: `${edgeData.src}-${edgeData.dst}-${edgeData.ranking}`,
  source: edgeData.src,
  target: edgeData.dst,
  ranking: edgeData.ranking,
  data: {
    linkType: "access",
    stateType: "regular",
    action: edgeData.props?.action,
    eventTime: edgeData.props?.event_time,
    ruleId: edgeData.props?.rule_id,
  },
}),
```

如果边有合并多条的合边逻辑，还需在 `edgesProcessorMap` 中添加合边处理器：

```ts
access: (edgeGroup) => {
  const edges = edgeGroup.edges.map(
    (edge) => edgeProcessorMap["access"](edge) as AccessLinkType,
  );
  const pairKey = /* 节点对 key 计算 */;
  return [{
    id: pairKey + "-access",
    source: edgeGroup.id.src,
    target: edgeGroup.id.dst,
    ranking: 0,
    data: {
      linkType: "access",
      stateType: "regular",
      label: key,               // 合并后显示的时间范围
      propsList: edges,
    },
  }];
},
```

---

## 三、可用 Canvas 绘制 API

通过 `makeDrawWrapper(ctx)` 获取链式绘制对象：

| 方法 | 参数 | 说明 |
|------|------|------|
| `.circle(x, y, radius, color, opacity?)` | 圆心、半径、填充色 | 画实心圆 |
| `.stroke(x, y, radius, color, width?, opacity?)` | 圆心、半径、颜色、线宽 | 画圆边框 |
| `.text(text, x, y, fontSize, color, opacity?)` | 文字、位置、字号 | 绘制单行文字 |
| `.multiColorText(segments[], x, y)` | 多段文字（每段可独立颜色/字号） | 绘制多色文字 |
| `.drawImg(cache, src, x, y, w, h, opacity?)` | 图片缓存、路径、位置 | 绘制图标 |
| `.textWrap(text, x, y, size, color, opacity, maxWidth)` | 同上+最大宽度 | 自动换行文字 |

---

## 四、通用属性自动注入

所有节点自动带有以下属性（由 `buildNodeCommonProp` 和 `entity/common.ts` 包装器注入）：

| 属性 | 说明 |
|------|------|
| `pageIndex` | 分页索引 |
| `count` / `total` | 邻居节点计数（用于显示 `(count/total)` 分页信息） |

渲染器自动注入的通用绘制逻辑（由 `common.ts` 中的 `createEntity` 包装器实现）：

| 功能 | 说明 |
|------|------|
| **光晕** | 当 `style.light` 有值时自动绘制 |
| **加载动画** | 节点加载中时自动显示旋转指示器 |
| **标签** | 自动渲染节点的标签文字 |
| **涉案标记 (mask)** | `isInvolveEvid` 为 true 时自动绘制涉案角标 |

---

## 五、新增实体完整清单速查

在 `entity/` 和 `links/` 中新增一个类型需要注册到以下 5 个位置：

| # | 文件 | 操作 |
|---|------|------|
| 1 | `entity/{name}/index.ts` | 导出所有模块 |
| 2 | `entity/index.client.ts` | 导出客户端创建器 |
| 3 | `entity/index.ts` | 导出类型/样式/元数据 |
| 4 | `entity/metadata.ts` | 注册到 `getNodeMetadataMap` |
| 5 | `network-analysis-entity-registry.ts` | 注册到 `getEntityCreators` 映射 |
| 6 | `network-analysis-map.server.ts` | 注册到 `nodeProcessorMap`（数据转换） |
| 7 | `network-analysis-style.ts` | 注册到 `nodeStyleMap`（可选） |

对于边，额外需要：

| # | 文件 | 操作 |
|---|------|------|
| 1 | `links/{name}/index.ts` | 导出所有模块 |
| 2 | `links/index.ts` | 导出模块 |
| 3 | `links/metadata.ts` | 注册到 `linkMetadataMap` |
| 4 | `network-analysis-map.server.ts` | 注册到 `edgeProcessorMap` 和 `edgesProcessorMap` |
