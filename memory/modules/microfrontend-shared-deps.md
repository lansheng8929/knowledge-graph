# 前端共享依赖（微前端）

## 理解 (2026-08-06)

- 方案：原生 Single-SPA + **原生 importmap + ESM**，共享依赖（react/react-dom/scheduler）用 **jspm** 转标准 ESM 自托管到 `apps/shell/public/shared/`，importmap 提供一次 → **单一实例、单一下载、零运行时、无格式锁定**。
- 演进：曾跑通 SystemJS + System.register（已验证），因格式锁定 + 运行时开销弃用。React 18 转 ESM 极难（UMD 守卫），只有 jspm 能正确转。
- 链路三处必须一致（版本不漂移）：`shared/deps/shared-externals.json`（子应用 external）↔ 共享产物文件名 ↔ `importmap.json` 共享条目；由 `shared:detect` + `shared:build` 自动生成并合并。
- 子应用 single-spa 构建 `formats:["es"]` + `external:[...sharedExternals]`，产物是 ESM 裸说明符（`import {useState} from "react"` / `import bn from "react-dom"`）。
- 验证方法：生产预览（`vite preview apps/shell --port 4174`）→ `import('react')` 两次===同实例 + `import('graph-app'|'import-app'|'user-app')` 返回生命周期 + 零 console error。
- 发布链：3 个 `publish-*.sh` 发布前自动 `shared:detect && shared:build`；`build-shared-deps.mjs` 先下载临时目录再 `renameSync` 原子替换（网络失败不清空现有产物）。
- 关键坑：
  - **vite dev jsx-dev-runtime**：plugin-react 把 JSX 转成 `import {jsxDEV} from "react/jsx-dev-runtime"`（转换后生成，vite 扫描扫不到）→ 容器重建/清 `.vite` 后必现 Failed to resolve + 预构建 504 → 修 `optimizeDeps.include` react 全家桶 + `.frag/.vert` loader + `docker restart kg-dev-web`。
  - SystemJS 6 浏览器核心已移除 CJS/AMD/UMD；`@esm-bundle/react` 只有 React 17。
  - 子应用 es 产物：rollup 把 `react-dom/client` 归一化成 `react-dom`；importmap 需覆盖 react / react-dom / react-dom/client（jspm 独立 -client.js）/ react/jsx-runtime / scheduler。
  - bun 未根 hoist：scheduler 在根 `node_modules/.bun` store，版本解析 fallback `0.23.2`。

## 文件关联

- `scripts/detect-shared-deps.mjs` — 自动扫 apps 依赖交集，生成 external 清单 + 合并 importmap
- `scripts/build-shared-deps.mjs` — 从 jspm CDN 下载共享依赖 ESM（原子替换）
- `apps/*/vite.single-spa.config.ts` — 子应用 es 格式 + external 共享依赖
- `apps/shell/src/main.ts` / `index.html` / `public/importmap.json` — 原生 importmap + `import()`
- `apps/shell/public/shared/` — jspm ESM 共享产物（react/react-dom/client/jsx-runtime/scheduler）
- `apps/shell/nginx.conf` — 带版本 js 配 `expires 1y + immutable`
