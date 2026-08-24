import { LitElement, css, html } from "lit"

export class HomeView extends LitElement {
  static styles = css`
    h1 {
      margin: 0 0 8px;
      font-size: 20px;
    }
    p {
      margin: 0;
      color: rgb(var(--muted-foreground));
      font-size: 14px;
    }
  `

  render() {
    return html`
      <h1>知识图谱平台</h1>
      <p>从导航进入「图谱」或「数据导入」模块。</p>
    `
  }
}

customElements.define("home-view", HomeView)
