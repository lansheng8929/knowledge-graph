# apps/shell — 主应用壳（Single-SPA root-config）

> 对应架构 §3.3.4 / 计划 T2.3（Phase 2）

## 职责

- Single-SPA root-config：注册 / 路由子应用（当前 `graph-app`）
- 统一导航（`/graph/*` 路由段）
- 后续：统一登录态（token 注入）、品牌主题 CSS 变量、import-map 动态下发

## 运行

```bash
# 根目录 bun install 已链接 workspaces（apps/*）
bun run --cwd apps/shell dev      # :3001
# 访问 http://localhost:3001/graph → 加载 graph-app 子应用
```

## 当前集成方式

`src/main.ts` 用 `registerApplication` 动态 import `apps/graph-app/src/single-spa`（生命周期 `bootstrap/mount/unmount`）。
同仓引用（不发布包、无 SystemJS）；后续可演进为 import-map 远程加载。

## 状态

- [x] T2.3.1 壳工程（root-config 注册 graph-app）
- [x] T2.3.2 路由段 `/graph/*`（本地引用，import-map 动态下发待后续）
- [ ] T2.3.3 鉴权注入（Phase 4 IDP 后）
- [ ] T2.3.4 主题 CSS 变量统一
- [ ] T2.3.5 样式/JS 隔离约定验证
