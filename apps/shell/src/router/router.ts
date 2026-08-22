import { matchShellRoute, type ShellRoute } from "./routes"

export const ROUTE_CHANGE_EVENT = "shell:route-change"

// 触发 ROUTE_CHANGE_EVENT
function dispatch(): void {
  window.dispatchEvent(new CustomEvent(ROUTE_CHANGE_EVENT))
}

export const router = {
  init(): void {
    // 用户点击前进/后退时触发
    window.addEventListener("popstate", dispatch)
    // 子应用切换时触发
    window.addEventListener("single-spa:app-change", dispatch)
  },

  navigate(to: string): void {
    history.pushState({}, "", to)
    dispatch()
  },

  get current(): ShellRoute | null {
    return matchShellRoute(location.pathname)
  },

  listen(cb: () => void): () => void {
    window.addEventListener(ROUTE_CHANGE_EVENT, cb)
    return () => window.removeEventListener(ROUTE_CHANGE_EVENT, cb)
  },
}
