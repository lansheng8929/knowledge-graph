/** auth-service API 客户端（经 shell 代理 / 网关）。 */

import type { UserInfo } from "./types"

let authToken = ""

export function setAuthToken(token: string): void {
  authToken = token
}

export async function fetchUserInfo(): Promise<UserInfo> {
  const headers: Record<string, string> = {}
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`
  const res = await fetch("/api/v1/auth/userinfo", { headers })
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    const detail = (body as { detail?: string } | null)?.detail
    throw new Error(detail || `HTTP ${res.status}`)
  }
  return (body as { data: { user: UserInfo } }).data.user
}
