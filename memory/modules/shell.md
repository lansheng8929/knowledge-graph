# Shell 壳层

## 理解 (2026-08-22)

- shell 是 Single-SPA root-config（`apps/shell`），注册 graph-app / import-app / user-app（`/graph`、`/import`、`/user`）
- 壳层页面路由（首页/404/登录跳转）用轻量自研 router：`src/router/{routes,router,view-container}.ts`；`matchShellRoute` 用 `SUBAPP_PREFIXES` 避免与 single-spa 抢路径
- 组件体系：**Lit**（`LitElement` + `html`/`css` 标签模板），2026-08-23 从自研 `BaseComponent` 全量迁移；依赖 `lit@^3.2.1`（仅 shell 用，走 vite 打包不参与 importmap）；`view-container` 仍是纯 HTMLElement（挂载容器无模板）；删除 `base/BaseComponent.ts` + `base/html.ts`
- chat 是 Web Component：左下角圆形 fab 按钮 + `[open]` 属性控制面板开合（纯 CSS transition 可中断可逆）
- **SPA 化关键**：single-spa 不拦截普通 `<a>`；shell 在 `main.ts` 全局拦截站内链接 → `router.navigate`（history.pushState），否则每次导航整页刷新
- 路由切换过渡：壳层视图淡出淡入（`viewIn/viewOut`）、子应用容器 `appIn` 淡入；`--ease-out` 全局 token 在 tokens.css

## 文件关联

- `apps/shell/src/main.ts` - 装配：注册子应用 + 登录状态机 + 链接拦截
- `apps/shell/src/router/*` - 壳层路由（routes/router/view-container）
- `apps/shell/src/components/chat.ts` - 聊天组件（LitElement：fab + 面板 + SSE 流式 + `[open]` 反射）
- `apps/shell/src/components/login.ts` - 登录（LitElement：表单/错误/提交态）
- `apps/shell/src/components/chat.ts` - 聊天组件（fab + 面板 + SSE 流式）
- `apps/shell/src/components/layout/{home-view,not-found-view}.ts` - 壳层视图
- `apps/shell/src/styles/tokens.css` - 主题 token + `--ease-out`
- `docs/shell-router-component-plan.md` - 规划/分步手册
