export interface GlobalUser {
  uid: string
  username: string
}

export const USER_COOKIE = "kg_user"
export const AUTH_CHANGE_EVENT = "kg-auth-change"

declare global {
  interface Window {
    __KG_USER__?: GlobalUser
  }
}

function readUserCookie(): GlobalUser | null {
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${USER_COOKIE}=`))
  if (!raw) return null
  try {
    const data = JSON.parse(
      decodeURIComponent(raw.slice(USER_COOKIE.length + 1)),
    ) as { uid?: string; username?: string }
    if (!data.uid && !data.username) return null
    return {
      uid: String(data.uid ?? ""),
      username: String(data.username ?? ""),
    }
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
    localStorage.removeItem("kg-token")
    window.__KG_USER__ = readUserCookie() ?? undefined
  },

  setUser(user: { uid?: string; username?: string }): void {
    window.__KG_USER__ = {
      uid: String(user.uid ?? ""),
      username: String(user.username ?? ""),
    }
    emitChange()
  },

  clear(): void {
    window.__KG_USER__ = undefined
    emitChange()
  },
}
