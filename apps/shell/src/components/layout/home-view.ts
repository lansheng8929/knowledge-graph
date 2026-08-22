import { BaseComponent } from "../base/BaseComponent"

export class HomeView extends BaseComponent {
  template(): string {
    return `
      <h1>知识图谱平台</h1>
      <p>从导航进入「图谱」或「数据导入」模块。</p>
    `
  }

  protected styles(): string {
    return `
      h1 { margin: 0 0 8px; font-size: 20px; }
      p { margin: 0; color: rgb(var(--muted-foreground)); font-size: 14px; }
    `
  }
}

customElements.define("home-view", HomeView)
