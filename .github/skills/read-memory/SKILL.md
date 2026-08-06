---
name: read-memory
description: |
  读取项目记忆技能。在用户提及或编辑已记录的模块时，自动从 memory/ 读取既有理解注入上下文。
  适用场景:
  - 用户提到某个已记录的模块名
  - 用户编辑已有模块记忆的源文件
  - 用户说"回顾上次会话""之前怎么做的""先看看笔记"
  - 新会话开始时，用户没有说任何触发词但正在编辑已记录模块的文件
  核心策略: 只读不写，文件名模糊匹配模块名。
---

# 读取项目记忆

> **路径基准**: 当前项目工作区根目录下的 `memory/` 文件夹。
> 使用 `read_file` 工具读取。

## 触发规则

### 自动触发

当用户编辑或提及以下文件/模块时，自动检查对应记忆：

| 源文件路径片段                   | 对应记忆文件                                       |
| -------------------------------- | -------------------------------------------------- |
| `use-box-selection`              | `memory/modules/network-analysis-box-selection.md` |
| `network-analysis-box-selection` | `memory/modules/network-analysis-box-selection.md` |
| `network-analysis-graph`         | `memory/modules/network-analysis-graph.md`         |
| `force-graph.client`             | `memory/modules/force-graph.md`                    |

> 补充规则：检查 `memory/modules/` 目录下所有 `.md` 文件（排除 INDEX.md），其文件名（去掉 .md）与用户提及的模块名或编辑的文件路径做**包含匹配**。匹配到就读。

### 手动触发

用户说以下关键词时触发：

- "回顾上次会话" / "之前怎么做的" / "先看看笔记"
- "回忆一下 xxx" / "xxx 模块有什么记录"
- "看 memory" / "读记忆"

手动触发时：

1. 如果是特定模块 → 读 `memory/modules/<模块>.md`
2. 如果是"上次会话" → 读 `memory/sessions/` 下最新日期的文件
3. 如果是"所有笔记" → 列出 `memory/modules/` 目录内容

## 工作流程

1. 确定触发类型（自动 / 手动）
2. 确定目标文件路径
3. 使用 `read_file` 读取（通常 1-80 行足够，不必全文）
4. 将内容以简短摘要注入当前上下文，不逐字复述

## 输出格式

读取后以简洁方式告知用户，例如：

```
📋 memory/modules/network-analysis-box-selection.md:
   - useBoxSelection: 纯状态 hook，管理 selection/enabled/isDragging
   - BoxSelectionOverlay: 覆盖层 div，pointer-events auto/none 控制
   - mousemove 用 RAF 节流，坐标基于 e.currentTarget
   - 相关文件: use-box-selection.ts, network-analysis-box-selection.tsx, providers.tsx, index.tsx
```

## 约束

- 只读不写，不修改任何 memory 文件
- 不读取 INDEX.md（它是索引，不是记忆内容）
- 如果未匹配到任何文件，告知用户"暂无相关记忆"
