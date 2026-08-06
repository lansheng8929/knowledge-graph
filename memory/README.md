# memory — 项目记忆

增量记录 AI 会话对项目模块的理解与变更决策，供后续会话恢复上下文。

## 目录

- `sessions/` — 会话级变更记录（按日期 `YYYY-MM-DD.md`）
- `modules/` — 模块级理解文档（kebab-case 命名，`INDEX.md` 维护索引）

## 使用

- 新增信息**增量追加**到对应文件末尾（`replace_string_in_file`），不整读文件。
- 所有条目标注日期 `YYYY-MM-DD`。
- 记录方式见 `.github/skills/incremental-memory/SKILL.md`。
