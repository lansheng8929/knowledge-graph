export abstract class BaseComponent extends HTMLElement {
  protected shadow: ShadowRoot

  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: "open" })
  }

  protected abstract template(): string

  protected styles(): string {
    return ""
  }

  connectedCallback(): void {
    this.shadow.innerHTML = `<style>${this.styles()}</style>${this.template()}`
    this.onMount()
  }

  protected onMount(): void {}
}
