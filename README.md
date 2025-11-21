# knowledge-graph

知识图谱可视化库，支持动态节点类型注册和自定义渲染。

## 安装依赖

```bash
bun install
```

## 运行

```bash
bun run ./graph/index.ts
```

## Entity Registry

从最新版本开始，实体（节点类型）定义已迁移到外部注册机制。详细使用方法请参阅 [Entity Migration Guide](./ENTITY_MIGRATION.md)。

### 快速开始

```typescript
import { 
  ConnGraphModel, 
  ConnGraphView,
  EntityRegistry,
  getDefaultEntityCreators 
} from './graph'

// 创建并配置 EntityRegistry
const entityRegistry = new EntityRegistry()
entityRegistry.registerBatch(getDefaultEntityCreators())

// 创建模型
const model = new ConnGraphModel({
  initData: {
    graphData: { nodes: [], links: [] }
  },
  entityRegistry
})

// 创建视图
const view = new ConnGraphView({
  container: document.getElementById('graph-container'),
  graphModel: model
})
```

This project was created using `bun init` in bun v1.2.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
