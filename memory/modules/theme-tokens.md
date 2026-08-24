# 主题 Token / 深浅模式

## 理解 (2026-08-24)

- 主题变量的**唯一来源**是 `apps/shell/src/styles/tokens.css`，所有子模块（graph-app/import-app/user-app/chat）都从这里继承，不得新增全局变量。
- 主题分两套：`:root / [data-theme="light"]` 与 `[data-theme="dark"]`，通过 `<html>` 上的 `data-theme` 属性切换（CSS 变量随之自动重算）。
- **主色（品牌色）是玫红/玫瑰红**：浅色 `--primary: 233 69 96`（≈#E94560），深色 `--primary: 244 63 94`（≈#F43F5E）。未找到品牌文档，属历史约定，全平台共用。
- 深浅切换逻辑在 `apps/graph-app/src/hooks/useTheme.tsx`：`ThemeProvider` 设置 `document.documentElement.dataset.theme`，并持久化到 `localStorage["kg-theme"]`（"dark"/"light"，默认 light）。
- token 值是**空格分隔的 RGB 三元组**；加透明度必须用 `rgb(var(--x) / α)`，不能用 `rgba(var(--x), α)`（后者对空格分隔值无效）。
- CSS 自定义属性可穿透 Shadow DOM 继承，所以 Lit/web component（如 chat）无需 JS，改 `data-theme` 即自动切换。
- chat.ts 曾硬编码深色系 + 蓝色主色（`--primary: 59,130,246`），已改为继承全局 token；毛玻璃变量（`--glass-*`）也全部基于 `var(--surface)/var(--border)` 派生。

## 文件关联

- `apps/shell/src/styles/tokens.css` - 主题 token 定义（唯一来源）
- `apps/graph-app/src/hooks/useTheme.tsx` - ThemeProvider / 深浅切换 / localStorage 持久化
- `apps/shell/src/components/chat.ts` - 消费全局 token 的示例（Lit shadow DOM）
