/**
 * Single-SPA root-config（T2.3.1 / T2.3.2 + 原生 importmap 共享依赖）。
 *
 * dev：同仓引用子应用源码（热更）；生产：原生 importmap 加载子应用 ESM 产物
 * 与共享依赖 ESM（react/react-dom 单一实例）。
 */

import { navigateToUrl, registerApplication, start } from "single-spa"
// 平台主题 token 单一来源（壳层加载，供所有子模块读取）
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

// ── token 生命周期（内存 + sessionStorage）────────────
// 生产流程：无默认/演示账号、无 URL 覆盖；token 由登录界面换取后注入。
// sessionStorage 仅会话内持久：刷新保持登录，关闭标签页即失效需重新登录。
const TOKEN_KEY = "kg-token"
let token = sessionStorage.getItem(TOKEN_KEY) ?? ""
;(window as { __KG_TOKEN__?: string }).__KG_TOKEN__ = token || undefined

// ── 当前用户芯片（导航右上角，点击进个人中心 /user）──────
const userChip = document.getElementById("shell-user") as HTMLElement | null

function decodeJwtPayload(t: string): Record<string, unknown> | null {
  try {
    const payload = t.split(".")[1] ?? ""
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

function refreshUserChip(): void {
  if (!userChip) return
  const tok = (window as { __KG_TOKEN__?: string }).__KG_TOKEN__
  const payload = tok ? decodeJwtPayload(tok) : null
  const name = String(payload?.sub ?? "") || String(payload?.uid ?? "")
  if (name) {
    userChip.textContent = name
    userChip.hidden = false
  } else {
    userChip.hidden = true
  }
}

// ─────────────────────────────────────────────────────
// 配置：隐藏壳层导航的路由前缀。
// 命中时 #shell-nav 隐藏，子应用自动占满整屏。
// 当前：图谱模块 = 全屏独立模块（不显示顶部菜单）
// ─────────────────────────────────────────────────────
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

const loginView = document.getElementById("login-view") as HTMLElement
const loginForm = document.getElementById("login-form") as HTMLFormElement
const loginError = document.getElementById("login-error") as HTMLElement
const usernameInput = document.getElementById(
  "login-username",
) as HTMLInputElement
const passwordInput = document.getElementById(
  "login-password",
) as HTMLInputElement
const loginSubmit = document.getElementById("login-submit") as HTMLButtonElement
const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement

function showLogin(): void {
  loginView.hidden = false
  usernameInput.focus()
}
function hideLogin(): void {
  loginView.hidden = true
}
function clearAuth(): void {
  token = ""
  ;(window as { __KG_TOKEN__?: string }).__KG_TOKEN__ = undefined
  sessionStorage.removeItem(TOKEN_KEY)
}

async function handleLogin(e: Event): Promise<void> {
  e.preventDefault()
  const username = usernameInput.value.trim()
  const password = passwordInput.value
  if (!username || !password) {
    loginError.textContent = "请输入用户名和密码"
    return
  }
  loginError.textContent = ""
  loginSubmit.disabled = true
  loginSubmit.textContent = "登录中…"
  try {
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as {
        detail?: string
      } | null
      throw new Error(body?.detail ?? `登录失败（HTTP ${res.status}）`)
    }
    const j = (await res.json()) as { data?: { token?: string } }
    const tok = j?.data?.token
    if (!tok) throw new Error("服务端未返回 token")
    token = tok
    ;(window as { __KG_TOKEN__?: string }).__KG_TOKEN__ = tok
    sessionStorage.setItem(TOKEN_KEY, tok)
    refreshUserChip()
    hideLogin()
    startSpa()
    // 登录后落在首页（菜单栏可见），不直接进入图谱模块
    if (location.pathname !== "/") navigateToUrl("/")
  } catch (err) {
    loginError.textContent = err instanceof Error ? err.message : String(err)
  } finally {
    loginSubmit.disabled = false
    loginSubmit.textContent = "登 录"
  }
}

logoutBtn.addEventListener("click", () => {
  clearAuth()
  refreshUserChip()
  passwordInput.value = ""
  showLogin()
})

loginForm.addEventListener("submit", handleLogin)

// 启动前先确认登录态：有未过期 token 直接进系统，否则显示登录界面
if (hasValidToken(token)) {
  hideLogin()
  startSpa()
} else {
  clearAuth()
  showLogin()
}
refreshUserChip()
