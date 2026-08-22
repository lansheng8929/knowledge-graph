import { BaseComponent } from "../base/BaseComponent"

export class NotFoundView extends BaseComponent {
  template(): string {
    return `
      <h1>404 · 页面不存在</h1>
      <a href="/">返回首页</a>
    `
  }

  protected styles(): string {
    return `
      h1 { margin: 0 0 8px; font-size: 20px; }
      a { color: rgb(var(--overlay-bg)); font-size: 14px; }
    `
  }
}

customElements.define("not-found-view", NotFoundView)
