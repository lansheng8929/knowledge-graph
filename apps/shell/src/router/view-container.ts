import { matchShellRoute } from "./routes"
import { router } from "./router"

const LEAVE_MS = 120 // 与 .view-leave 动画时长一致

export class ViewContainer extends HTMLElement {
  private leaveTimer = 0

  connectedCallback(): void {
    this.render()
    router.listen(() => this.render())
  }

  private render(): void {
    window.clearTimeout(this.leaveTimer)
    const route = matchShellRoute(location.pathname)
    const tag = route?.view().tag ?? null
    const current = this.firstElementChild

    if (current && tag && current.localName !== tag) {
      // 旧视图淡出后再替换，避免瞬切闪烁
      current.classList.add("view-leave")
      this.leaveTimer = window.setTimeout(() => {
        this.replaceChildren()
        if (tag) this.mount(tag)
      }, LEAVE_MS)
    } else {
      this.replaceChildren()
      if (tag) this.mount(tag)
    }
  }

  private mount(tag: string): void {
    this.appendChild(document.createElement(tag))
  }
}

customElements.define("view-container", ViewContainer)
