export interface GlobalUser {
  uid: string
  username: string
  token: string
  payload: Record<string, unknown>
}

export const TOKEN_KEY = "kg-token"
export const AUTH_CHANGE_EVENT = "kg-auth-change"

declare global {
  interface Window {
    __KG_TOKEN__?: string
    __KG_USER__?: GlobalUser
  }
}

function decodeJwtPayload(t: string): Record<string, unknown> | null {
  try {
    const payload = t.split(".")[1] ?? ""
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

function emitChange(): void {
  window.dispatchEvent(
    new CustomEvent<GlobalUser | null>(AUTH_CHANGE_EVENT, {
      detail: authStore.user,
    }),
  )
}

export const authStore = {
  get user(): GlobalUser | null {
    return window.__KG_USER__ ?? null
  },

  init(): void {
    const tok = sessionStorage.getItem(TOKEN_KEY)
    if (tok) this.setToken(tok)
  },

  setToken(token: string): void {
    const payload = decodeJwtPayload(token) ?? {}
    const user: GlobalUser = {
      uid: String(payload.uid ?? payload.sub ?? ""),
      username: String(payload.username ?? payload.sub ?? ""),
      token,
      payload,
    }
    window.__KG_TOKEN__ = token
    window.__KG_USER__ = user
    sessionStorage.setItem(TOKEN_KEY, token)
    emitChange()
  },

  clear(): void {
    window.__KG_TOKEN__ = undefined
    window.__KG_USER__ = undefined
    sessionStorage.removeItem(TOKEN_KEY)
    emitChange()
  },
}
