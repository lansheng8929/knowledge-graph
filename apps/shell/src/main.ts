import { registerApplication, start } from "single-spa"

import "./components/chat"
import { LoginView } from "./components/login"
import { AUTH_CHANGE_EVENT, authStore } from "./utils/auth"

import "./router/view-container"
import { router } from "./router/router"
import "./components/layout/home-view"
import "./components/layout/not-found-view"

import "./styles/tokens.css"
import { getSharedBaseSheet } from "./styles/global-sheets"

document.adoptedStyleSheets = [
  getSharedBaseSheet(),
  ...document.adoptedStyleSheets,
]

// T2.3.4 前端单模块更新 + 原生 importmap：
//   - 开发(dev)：同仓 import 源码 → 改码即热更（不改构建）
//   - 构建/生产：原生 importmap 加载子应用 ESM 产物 + 共享依赖 ESM
//     （index.html 注入 importmap，映射版本 URL + 共享依赖）
//     → 更新/回滚某子应用 = 只换产物 URL，其它模块零改动
// 注意：生产分支用「变量」动态 import——vite dev 的 import-analysis 对字面量也会
// 静态解析（曾报 Failed to resolve "graph-app"），变量形式则跳过解析、运行时才解析。
const GRAPH_APP_ENTRY = "graph-app"
const loadGraphApp = import.meta.env.DEV
  ? () => import("../../graph-app/src/single-spa")
  : () => import(/* @vite-ignore */ GRAPH_APP_ENTRY)

// import-app（数据导入模块，T3.1 / import-module-plan）：
// dev 同仓 import 源码；生产经 importmap 加载独立产物 import-app.js
const IMPORT_APP_ENTRY = "import-app"
const loadImportApp = import.meta.env.DEV
  ? () => import("../../import-app/src/single-spa")
  : () => import(/* @vite-ignore */ IMPORT_APP_ENTRY)

// user-app（用户模块 /user/*：个人中心）
const USER_APP_ENTRY = "user-app"
const loadUserApp = import.meta.env.DEV
  ? () => import("../../user-app/src/single-spa")
  : () => import(/* @vite-ignore */ USER_APP_ENTRY)

authStore.init()

// ── 当前用户芯片（导航右上角，点击进个人中心 /user）──────
const userChip = document.getElementById("shell-user") as HTMLElement | null

function refreshUserChip(): void {
  if (!userChip) return
  const user = authStore.user
  const name = user?.username || user?.uid || ""
  if (name) {
    userChip.textContent = name
    userChip.hidden = false
  } else {
    userChip.hidden = true
  }
}

function mountChat(): void {
  const user = authStore.user
  if (!user) return
  const existing = document.querySelector("chat-component")
  if (existing && existing.getAttribute("user-id") === user.uid) return
  existing?.remove()
  const el = document.createElement("chat-component")
  el.id = "chat"
  el.setAttribute("user-id", user.uid)
  el.setAttribute("username", user.username)
  document.body.appendChild(el)
}

function applyNavVisibility(): void {
  const nav = document.getElementById("shell-nav")
  if (!nav) return
  nav.style.display = router.current?.hideNav ? "none" : ""
}

registerApplication({
  name: "graph-app",
  app: loadGraphApp,
  activeWhen: (location) => location.pathname.startsWith("/graph"),
  // T2.3.3 + T4.1.1：鉴权由网关 httpOnly Cookie（kg_session）逐请求校验，
  // 不再向前端下发 token；子应用请求自带 Cookie 即可
  customProps: () => ({
    auth: {
      token: "",
      tenantId: "",
    },
  }),
})

// 数据导入模块（/import/*）：保留壳层导航，便于在导入页与其它模块间往返
registerApplication({
  name: "import-app",
  app: loadImportApp,
  activeWhen: (location) => location.pathname.startsWith("/import"),
  customProps: () => ({
    auth: {
      token: "",
      tenantId: "",
    },
  }),
})

// 用户模块（/user/*）：个人中心，显示当前用户信息
registerApplication({
  name: "user-app",
  app: loadUserApp,
  activeWhen: (location) => location.pathname.startsWith("/user"),
  customProps: () => ({
    auth: {
      token: "",
      tenantId: "",
    },
  }),
})

// ── 路由：单一事件源驱动导航高亮/显隐/壳层视图 ──
const links = Array.from(
  document.querySelectorAll<HTMLAnchorElement>("a[data-route]"),
)
function refreshActive(): void {
  links.forEach((a) => {
    const route = a.dataset.route
    if (!route) return
    // 首页 "/" 用精确匹配（否则任何路径都以 / 开头，首页永远高亮）
    const active =
      route === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(route)
    a.classList.toggle("active", active)
  })
}
router.init()
router.listen(() => {
  refreshActive()
  applyNavVisibility()
})

// 站内链接走 SPA 导航（history.pushState），避免整页刷新导致白屏闪烁。
// single-spa 不会拦截普通 <a>，必须自己处理。
document.addEventListener("click", (e: MouseEvent) => {
  if (
    e.defaultPrevented ||
    e.button !== 0 ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey
  )
    return
  const anchor = (e.target as Element).closest<HTMLAnchorElement>("a[href]")
  if (!anchor) return
  const href = anchor.getAttribute("href")
  if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return
  if (new URL(href, location.origin).origin !== location.origin) return
  e.preventDefault()
  router.navigate(href)
})

// ── 登录状态机（生产流程）───────────────────────────────
// 真实会话由服务端 httpOnly Cookie（kg_session）承载、网关逐请求校验；
// 前端仅凭 JS 可见的 kg_user 标记 cookie 判断登录态与用户身份。

let started = false
function startSpa(): void {
  if (started) return
  started = true
  start()
}

const loginEl = document.querySelector("login-view") as LoginView
const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement

// 登录态变化（本页登录/登出）→ 统一刷新 UI。
function applyAuthUi(): void {
  const loggedIn = authStore.user != null
  refreshUserChip()
  if (loggedIn) {
    loginEl.hide()
    if (!started) startSpa()
    mountChat()
  } else {
    loginEl.show()
    document.querySelector("chat-component")?.remove()
  }
}

loginEl.onSuccess = (user) => {
  authStore.setUser(user)
  if (location.pathname !== "/") router.navigate("/")
  applyAuthUi()
}

logoutBtn.addEventListener("click", async () => {
  try {
    await fetch("/api/v1/auth/logout", { method: "POST" })
  } catch {
    // 服务端不可达也继续本地清理
  }
  authStore.clear()
  loginEl.clearPassword()
})

window.addEventListener(AUTH_CHANGE_EVENT, applyAuthUi)
applyAuthUi()
