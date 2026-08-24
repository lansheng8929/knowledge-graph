import { LitElement, css, html } from "lit"

export class LoginView extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(
        circle at 30% 20%,
        rgb(var(--surface)),
        rgb(var(--background)) 70%
      );
      font-family: system-ui, sans-serif;
    }
    :host([hidden]) {
      display: none;
    }
    .login-card {
      width: 320px;
      padding: 32px 28px;
      border-radius: 12px;
      background: rgb(var(--surface));
      border: 1px solid rgb(var(--border) / 0.7);
      box-shadow: 0 20px 60px rgb(0 0 0 / 0.5);
      color: rgb(var(--foreground));
    }
    .login-card h1 {
      margin: 0 0 4px;
      font-size: 20px;
    }
    .login-card p.sub {
      margin: 0 0 20px;
      font-size: 13px;
      color: rgb(var(--muted-foreground));
    }
    .login-card label {
      display: block;
      font-size: 13px;
      color: rgb(var(--muted-foreground));
      margin: 12px 0 4px;
    }
    .login-card input {
      box-sizing: border-box;
      width: 100%;
      padding: 9px 10px;
      border-radius: 6px;
      border: 1px solid rgb(var(--border) / 0.8);
      background: rgb(var(--background));
      color: rgb(var(--foreground));
      font-size: 14px;
      outline: none;
    }
    .login-card input:focus {
      border-color: rgb(var(--overlay-bg));
    }
    .login-card button {
      width: 100%;
      margin-top: 20px;
      padding: 10px;
      border: none;
      border-radius: 6px;
      background: rgb(var(--primary));
      color: rgb(var(--primary-foreground));
      font-size: 14px;
      cursor: pointer;
    }
    .login-card button:disabled {
      opacity: 0.6;
      cursor: default;
    }
    .login-error {
      min-height: 18px;
      margin-top: 10px;
      font-size: 13px;
      color: rgb(var(--danger));
    }
  `

  static properties = {
    error: { state: true },
    submitting: { state: true },
  }

  /** 登录成功回调（shell 注入；会话 cookie 已由服务端下发，此处仅回传用户信息）。 */
  onSuccess: (user: { uid: string; username: string }) => void = () => {}

  declare error: string
  declare submitting: boolean

  constructor() {
    super()
    this.error = ""
    this.submitting = false
  }

  render() {
    return html`
      <form class="login-card" novalidate @submit=${this.handleLogin}>
        <h1>知识图谱平台</h1>
        <p class="sub">请使用平台账号登录</p>
        <label for="username">用户名</label>
        <input id="username" name="username" autocomplete="username" required />
        <label for="password">密码</label>
        <input
          id="password"
          name="password"
          type="password"
          autocomplete="current-password"
          required
        />
        <button type="submit" ?disabled=${this.submitting}>
          ${this.submitting ? "登录中…" : "登 录"}
        </button>
        <div class="login-error" role="alert">${this.error}</div>
      </form>
    `
  }

  /** 显示登录界面（聚焦用户名框）。 */
  show(): void {
    this.hidden = false
    this.updateComplete.then(() => {
      this.renderRoot.querySelector<HTMLInputElement>("#username")?.focus()
    })
  }

  /** 隐藏登录界面。 */
  hide(): void {
    this.hidden = true
  }

  /** 退出登录后清空密码框。 */
  clearPassword(): void {
    const input = this.renderRoot.querySelector<HTMLInputElement>("#password")
    if (input) input.value = ""
  }

  private handleLogin = async (e: Event): Promise<void> => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const username = (
      form.querySelector<HTMLInputElement>("#username")?.value ?? ""
    ).trim()
    const password =
      form.querySelector<HTMLInputElement>("#password")?.value ?? ""
    if (!username || !password) {
      this.error = "请输入用户名和密码"
      return
    }
    this.error = ""
    this.submitting = true
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
      const j = (await res.json()) as {
        data?: { user?: { uid?: string; username?: string } }
      }
      const user = j?.data?.user
      if (!user || !user.uid) throw new Error("服务端未返回用户信息")
      this.onSuccess({ uid: user.uid, username: user.username ?? "" })
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err)
    } finally {
      this.submitting = false
    }
  }
}

customElements.define("login-view", LoginView)
