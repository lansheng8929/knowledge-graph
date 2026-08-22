# Shell 壳层

## 理解 (2026-08-22)

- shell 是 Single-SPA root-config（`apps/shell`），注册 graph-app / import-app / user-app（`/graph`、`/import`、`/user`）
- 壳层页面路由（首页/404/登录跳转）用轻量自研 router：`src/router/{routes,router,view-container}.ts`；`matchShellRoute` 用 `SUBAPP_PREFIXES` 避免与 single-spa 抢路径
- 组件体系：原生 Web Components + `BaseComponent` 基类（template+shadow 样板收敛，样式走 tokens.css）
- chat 是 Web Component：左下角圆形 fab 按钮 + `[open]` 属性控制面板开合（纯 CSS transition 可中断可逆）
- **SPA 化关键**：single-spa 不拦截普通 `<a>`；shell 在 `main.ts` 全局拦截站内链接 → `router.navigate`（history.pushState），否则每次导航整页刷新
- 路由切换过渡：壳层视图淡出淡入（`viewIn/viewOut`）、子应用容器 `appIn` 淡入；`--ease-out` 全局 token 在 tokens.css

## 文件关联

- `apps/shell/src/main.ts` - 装配：注册子应用 + 登录状态机 + 链接拦截
- `apps/shell/src/router/*` - 壳层路由（routes/router/view-container）
- `apps/shell/src/components/base/BaseComponent.ts` - 组件基类
- `apps/shell/src/components/chat.ts` - 聊天组件（fab + 面板 + SSE 流式）
- `apps/shell/src/components/layout/{home-view,not-found-view}.ts` - 壳层视图
- `apps/shell/src/styles/tokens.css` - 主题 token + `--ease-out`
- `docs/shell-router-component-plan.md` - 规划/分步手册
