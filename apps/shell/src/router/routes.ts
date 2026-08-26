export const SUBAPP_PREFIXES = ["/graph", "/import", "/user", "/filter-config"] as const

export interface ShellView {
  tag: string
}

export interface ShellRoute {
  path: string
  view: () => ShellView
  hideNav?: boolean
  requiresAuth?: boolean
}

export const shellRoutes: ShellRoute[] = [
  { path: "/", view: () => ({ tag: "home-view" }) },
  { path: "*", view: () => ({ tag: "not-found-view" }) },
]

export function matchShellRoute(pathname: string): ShellRoute | null {
  if (SUBAPP_PREFIXES.some((p) => pathname.startsWith(p))) return null

  for (const r of shellRoutes) {
    if (r.path === "*") continue
    if (r.path === "/") {
      if (pathname === "/") return r
    } else if (pathname.startsWith(r.path)) {
      return r
    }
  }
  return shellRoutes.find((r) => r.path === "*") ?? null
}
