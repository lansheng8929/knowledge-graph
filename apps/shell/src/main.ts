import { navigateToUrl, registerApplication, start } from "single-spa"

import "./components/chat"
import { LoginView } from "./components/login"
import { authStore } from "./utils/auth"

import "./styles/tokens.css"

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
  document.querySelector("chat-component")?.remove()
  const el = document.createElement("chat-component")
  el.id = "chat"
  el.className = "chat"
  el.setAttribute("user-id", user.uid)
  el.setAttribute("username", user.username)
  document.body.appendChild(el)
}
if (authStore.user) mountChat()

const HIDE_NAV_PREFIXES: string[] = ["/graph"]

function applyNavVisibility(): void {
  const nav = document.getElementById("shell-nav")
  if (!nav) return
  const hidden = HIDE_NAV_PREFIXES.some((p) => location.pathname.startsWith(p))
  nav.style.display = hidden ? "none" : ""
}

registerApplication({
  name: "graph-app",
  app: loadGraphApp,
  activeWhen: (location) => location.pathname.startsWith("/graph"),
  // T2.3.3 + T4.1.1：鉴权注入通道——壳层换取 token 后填到这里，
  // 请求自动携带 Authorization: Bearer；网关校验后注入 X-User-Context
  customProps: () => ({
    auth: {
      token: (window as { __KG_TOKEN__?: string }).__KG_TOKEN__ ?? "",
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
      token: (window as { __KG_TOKEN__?: string }).__KG_TOKEN__ ?? "",
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
      token: (window as { __KG_TOKEN__?: string }).__KG_TOKEN__ ?? "",
      tenantId: "",
    },
  }),
})

// 壳层路由高亮（简单实现，无路由库）
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
function onRouteChange(): void {
  refreshActive()
  applyNavVisibility()
}
window.addEventListener("single-spa:app-change", onRouteChange)
onRouteChange()

// ── 登录状态机（生产流程）───────────────────────────────

let started = false
function startSpa(): void {
  if (started) return
  started = true
  start()
}

/** 解码 JWT 的 exp（秒）；非法返回 null。 */
function tokenExpiry(t: string): number | null {
  try {
    const payload = t.split(".")[1] ?? ""
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    return (JSON.parse(json) as { exp?: number }).exp ?? null
  } catch {
    return null
  }
}

function hasValidToken(t: string): boolean {
  const exp = tokenExpiry(t)
  return exp !== null && exp * 1000 > Date.now()
}

const loginEl = document.querySelector("login-view") as LoginView
const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement

loginEl.onSuccess = (tok) => {
  authStore.setToken(tok)
  refreshUserChip()
  mountChat()
  loginEl.hide()
  startSpa()

  if (location.pathname !== "/") navigateToUrl("/")
}

logoutBtn.addEventListener("click", () => {
  authStore.clear()
  refreshUserChip()
  document.querySelector("chat-component")?.remove()
  loginEl.clearPassword()
  loginEl.show()
})

if (hasValidToken(authStore.user?.token ?? "")) {
  loginEl.hide()
  startSpa()
} else {
  authStore.clear()
  loginEl.show()
}
refreshUserChip()
