---
name: incremental-memory
description: |
  增量记忆管理技能。用于将 AI 会话中对项目模块的理解和变更决策持久化到 memory/ 目录。
  适用场景:
  - 用户说"记住...""记录一下...""把这个理解存下来"
  - 会话结束时总结并记录关键发现
  - 对某个模块有了新的理解需要追加记录
  核心策略: 增量追加，不读取已有文件内容，避免上下文膨胀。
# 通过 / 命令直接调用（默认即 user-invocable: true，显式声明并给出参数提示）
user-invocable: true
argument-hint: "要记录的内容或模块名，如：把 xxx 模块的理解存下来"
---

# 增量记忆管理

> **重要**: `memory/` 指当前项目工作区根目录下的 `memory/` 文件夹（如 `d:\zjl\work\lingxi-web\memory/`）。
> 所有文件操作使用标准文件工具（`create_file`、`replace_string_in_file`），**不要**使用 `memory` 内置工具（它写入的是 VS Code 内部存储，不是项目目录）。

## 目录结构

```
memory/
├── README.md              # 使用说明
├── sessions/              # 会话级变更记录
│   └── YYYY-MM-DD.md      # 按日期组织的会话笔记
└── modules/               # 模块级理解文档
    └── <module-name>.md   # 每个模块的增量理解
```

## 工作流程

### 1. 记录会话变更 (`memory/sessions/`)

当用户要求记录本次会话的变更时:

1. 文件名: `memory/sessions/YYYY-MM-DD.md` (使用当天日期)
2. 检查文件是否存在:
   - 不存在 → 创建新文件，写入今日内容
   - 存在 → 使用 `memory` 工具 `str_replace` 在文件末尾前追加新条目
3. 格式:

```markdown
# YYYY-MM-DD 会话

## 变更

- [变更描述1]
- [变更描述2]

## 关键决策

- [决策描述]
```

4. 同一天多次记录时，直接追加到 `## 变更` 或 `## 关键决策` 小节下。

### 2. 记录模块理解 (`memory/modules/`)

当用户说"记住这个模块...""记录对 xxx 的理解"时:

1. 文件名: `memory/modules/<module-name>.md` (模块名用 kebab-case，如 `network-analysis-graph.md`)
2. 检查文件是否存在:
   - 不存在 → 创建新文件，包含标题和初次理解
   - 存在 → **不读取文件内容**，直接用 `memory` 工具的 `str_replace` 在文件末尾追加
3. 格式:

```markdown
# <模块名称>

## 理解 (YYYY-MM-DD)

- [理解点1]
- [理解点2]

## 文件关联

- `path/to/file.tsx` - 说明
```

4. 后续同一天追加时，在同一 `## 理解 (YYYY-MM-DD)` 小节下追加条目。
5. 不同日期追加时，新建 `## 理解 (YYYY-MM-DD)` 小节。

## 核心原则

1. **增量追加优先**: 新增信息时，直接使用 `replace_string_in_file` 在文件末尾追加，不读取整个文件。这避免了每次操作都消耗大量上下文 token。

2. **日期标注**: 所有新增内容必须标注日期 (`YYYY-MM-DD`)，便于追溯信息的新鲜度。

3. **去重检查**: 如果当前会话中已经记录过完全相同的信息，不要重复追加。

4. **模块名规范**: 模块文件名使用 kebab-case，与功能区的命名保持一致。例如:
   - `network-analysis-graph.md` — 网络分析图谱
   - `case-management.md` — 案件管理
   - `force-graph.md` — 力导向图组件

5. **索引维护**: 首次创建模块文件时，同步更新 `memory/modules/INDEX.md` 索引文件，记录模块名和一行简介。

## 追加技巧

在已有文件末尾追加时，使用 `replace_string_in_file` 替换文件最后一行。

```
old_string: (文件的最后一行内容)
new_string: (最后一行内容 + \n\n新增的 markdown 内容)
```

如果同一天已有对应小节，替换该小节的最后一行来追加新条目。

## 示例对话

**用户**: "记住，network-analysis-graph 模块的 handleNodeClick 函数会同时更新 selectedData 和 graphModel"

**Agent 操作**:

1. 检查 `memory/modules/network-analysis-graph.md` 是否存在
2. 存在 → 使用 `str_replace` 在 `## 理解 (2026-07-21)` 小节下追加新条目
3. 不存在 → 创建新文件
