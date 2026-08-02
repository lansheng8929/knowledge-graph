/**
 * Single-SPA root-config（T2.3.1 / T2.3.2）。
 *
 * 当前：本地同仓引用子应用生命周期（不发布包、不引入 SystemJS）；
 * 后续可演进为 import-map 动态下发（生产远程加载）。
 */

import { registerApplication, start } from "single-spa"

// T2.3.4 前端单模块更新：
//   - 开发(dev)：同仓 import 源码 → 改码即热更（不改构建）
//   - 构建/生产：经原生 importmap 加载独立子应用产物（index.html 映射版本 URL）
//     → 更新/回滚某子应用 = 只换产物 URL，其它模块零改动
// 注意：生产分支用「变量」动态 import——vite dev 的 import-analysis 对字面量也会
// 静态解析（曾报 Failed to resolve "graph-app"），变量形式则跳过解析、运行时才解析。
const GRAPH_APP_ENTRY = "graph-app"
const loadGraphApp = import.meta.env.DEV
  ? () => import("../../graph-app/src/single-spa")
  : () => import(/* @vite-ignore */ GRAPH_APP_ENTRY)

// T4.1.1 演示登录：向 auth-service 换取 JWT（经网关 /api/v1/auth/login）
// 用户选择：URL ?user= 优先 → localStorage kg-user → 默认 analyst
// 演示密码规则：<username>123（admin123/analyst123/...）
async function ensureToken(username: string): Promise<void> {
  if ((window as { __KG_TOKEN__?: string }).__KG_TOKEN__) return
  try {
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password: `${username}123` }),
    })
    if (!res.ok) {
      console.warn(`[shell] 登录失败 ${username}: ${res.status}`)
      return
    }
    const j = (await res.json()) as { data?: { token?: string } }
    const token = j?.data?.token ?? ""
    if (token) (window as { __KG_TOKEN__?: string }).__KG_TOKEN__ = token
  } catch (e) {
    // dev 直连后端（无网关鉴权）时可忽略
    console.warn("[shell] token 获取失败（dev 直连时忽略）", e)
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

// 壳层路由高亮（简单实现，无路由库）
const links = Array.from(
  document.querySelectorAll<HTMLAnchorElement>("a[data-route]"),
)
function refreshActive(): void {
  links.forEach((a) =>
    a.classList.toggle(
      "active",
      a.dataset.route ? location.pathname.startsWith(a.dataset.route) : false,
    ),
  )
}
function onRouteChange(): void {
  refreshActive()
  applyNavVisibility()
}
window.addEventListener("single-spa:app-change", onRouteChange)
onRouteChange()

// 启动前先确保演示登录 token（网关鉴权默认启用）
const urlUser = new URLSearchParams(location.search).get("user")
const username = urlUser || localStorage.getItem("kg-user") || "analyst"
void ensureToken(username).then(() => {
  start()
})
