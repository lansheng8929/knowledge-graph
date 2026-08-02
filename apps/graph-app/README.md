# apps/graph-app — 图谱前端（Single-SPA 子应用，React + Vite）

> 对应架构 §3.2.1 / 计划 T1.2（Phase 1）· 由 `vite-test/` 迁移而来

## 运行

```bash
cd apps/graph-app
bun install          # workspace 链接 @lansheng/knowledge-graph（graph/）
bun run dev          # Vite :3000，proxy /api/v1 → localhost:8001
```

## 配置

- `VITE_API_BASE`：API 基础地址（默认 `/api/v1`，走 Vite proxy）；生产由网关统一出口
- 渲染引擎 `@lansheng/knowledge-graph`：workspace 声明 + alias 指向 `graph/src`（T1.2.2）
- `src/api/config.ts`：`API_BASE` 常量 + `apiPost` 统一封装（T1.2.3 地址外置）

## 状态

- [x] T1.2.1 从 `vite-test/` 复制工程（前端部分）
- [x] T1.2.2 引擎引用：workspace + alias 路径调整（`../../graph/src`）
- [x] T1.2.3 API 地址外置（`src/api/config.ts`）
- [ ] T1.3.2 手写 fetch 替换为 `shared/api-client` SDK
- [ ] T2.3 作为 Single-SPA 子应用接入 `apps/shell`
