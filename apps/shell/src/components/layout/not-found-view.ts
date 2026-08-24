import { LitElement, css, html } from "lit"

export class NotFoundView extends LitElement {
  static styles = css`
    h1 {
      margin: 0 0 8px;
      font-size: 20px;
    }
    a {
      color: rgb(var(--overlay-bg));
      font-size: 14px;
    }
  `

  render() {
    return html`
      <h1>404 · 页面不存在</h1>
      <a href="/">返回首页</a>
    `
  }
}

customElements.define("not-found-view", NotFoundView)
