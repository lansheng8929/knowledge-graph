# 前端微前端约定（原生 Single-SPA）

> 对应架构 §3.3.5 / 计划 T2.3.5
> 原则：原生 single-spa **无自动 JS/样式沙箱**（不用 qiankun），隔离靠**约定 + 检查**。

## 1. 挂载边界

- 子应用导出 `bootstrap / mount / unmount` + `domElementGetter`（容器不存在自动创建）。
- 不在 `mount` 之外操作 DOM；卸载时 `root.unmount()` 并清理。

## 2. 样式隔离

- **类名前缀**：子应用组件类名加前缀（graph-app 用 `kg-`）；存量未加前缀的逐步迁移。
- **CSS 变量（品牌 token）单一来源**：当前 `apps/graph-app/src/styles/tokens.css`（`:root` 亮/暗两套），后续提取到 `shared/ui-kit`；子应用**不得**随意新增全局变量，只允许在 token 集内取值。
- **禁止全局元素选择器**（`body`/`html`/`div`），只允许 `:root` / `[data-theme]` 变量定义 + 具类名选择器。
- 子应用作为 single-spa 挂载时，必须显式 import 自己的 token/工具类（参考 `graph-app/src/single-spa.tsx`），与独立入口保持一致。

## 3. 全局副作用

- 子应用不直接修改 `document.body` / `document.title` / 滚动条 / 全局 `window`（除约定的注入点如 `setAuthToken`）。
- 需要影响壳层的操作（全屏、标题、菜单显隐）经壳层约定的机制（自定义事件 / props）。

## 4. 跨子应用通信

- 用**自定义事件 / postMessage**；**不 import 对方内部代码**。
- 壳层统一事件总线（自定义事件）承载登录态、主题、导航意图。

## 5. 主题统一

- 视觉统一靠 **CSS 变量（品牌 token）**，跨栈（React/Vue/Angular）可读。
- 壳层导航用品牌 token 值，与子应用一致。

## 6. 路由

- 壳层占主路由；子应用挂在自己路径段下（`/graph/*`、`/case/*`）。
- 壳层按路由配置导航显隐（`HIDE_NAV_PREFIXES`）。

## 检查清单（新子应用接入时）

- [ ] 生命周期 + domElementGetter 就绪
- [ ] token/工具类 import 与独立入口一致
- [ ] 类名前缀符合约定
- [ ] 无全局元素选择器 / 无 body 副作用
- [ ] 仅经事件/props 与壳层通信
