const TEMPLATE = `
  <style>
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
  </style>
  <form class="login-card" id="login-form" novalidate>
    <h1>知识图谱平台</h1>
    <p class="sub">请使用平台账号登录</p>
    <label for="login-username">用户名</label>
    <input
      id="login-username"
      name="username"
      autocomplete="username"
      required
    />
    <label for="login-password">密码</label>
    <input
      id="login-password"
      name="password"
      type="password"
      autocomplete="current-password"
      required
    />
    <button id="login-submit" type="submit">登 录</button>
    <div class="login-error" id="login-error" role="alert"></div>
  </form>
`

export class LoginView extends HTMLElement {
  private shadow!: ShadowRoot
  private form!: HTMLFormElement
  private errorEl!: HTMLElement
  private usernameInput!: HTMLInputElement
  private passwordInput!: HTMLInputElement
  private submitBtn!: HTMLButtonElement

  /** 登录成功回调（shell 注入；token 持久化 / startSpa 由 shell 处理）。 */
  onSuccess: (token: string) => void = () => {}

  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: "open" })
    const tpl = document.createElement("template")
    tpl.innerHTML = TEMPLATE
    this.shadow.appendChild(tpl.content.cloneNode(true))

    this.form = this.shadow.querySelector("#login-form")!
    this.errorEl = this.shadow.querySelector("#login-error")!
    this.usernameInput = this.shadow.querySelector("#login-username")!
    this.passwordInput = this.shadow.querySelector("#login-password")!
    this.submitBtn = this.shadow.querySelector("#login-submit")!
  }

  connectedCallback(): void {
    this.form.addEventListener("submit", this.handleLogin)
  }

  disconnectedCallback(): void {
    this.form.removeEventListener("submit", this.handleLogin)
  }

  /** 显示登录界面（聚焦用户名框）。 */
  show(): void {
    this.hidden = false
    this.usernameInput.focus()
  }

  /** 隐藏登录界面。 */
  hide(): void {
    this.hidden = true
  }

  /** 退出登录后清空密码框。 */
  clearPassword(): void {
    this.passwordInput.value = ""
  }

  private handleLogin = async (e: Event): Promise<void> => {
    e.preventDefault()
    const username = this.usernameInput.value.trim()
    const password = this.passwordInput.value
    if (!username || !password) {
      this.errorEl.textContent = "请输入用户名和密码"
      return
    }
    this.errorEl.textContent = ""
    this.submitBtn.disabled = true
    this.submitBtn.textContent = "登录中…"
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
      this.onSuccess(tok)
    } catch (err) {
      this.errorEl.textContent =
        err instanceof Error ? err.message : String(err)
    } finally {
      this.submitBtn.disabled = false
      this.submitBtn.textContent = "登 录"
    }
  }
}

customElements.define("login-view", LoginView)
