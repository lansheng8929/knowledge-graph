import { createRoot, type Root } from "react-dom/client"
import App from "./App"
import { setAuthToken } from "./api"
import "../../shell/src/styles/tokens.css"
import "./styles.css"

let root: Root | null = null

export const domElementGetter = (): HTMLElement => {
  let el = document.getElementById("single-spa-application:user-app")
  if (!el) {
    el = document.createElement("div")
    el.id = "single-spa-application:user-app"
    document.body.appendChild(el)
  }
  return el
}

export const bootstrap = async (): Promise<void> => {}

export const mount = async (props: {
  domElement?: HTMLElement
  auth?: { token?: string; tenantId?: string }
  [key: string]: unknown
}): Promise<void> => {
  const el = props.domElement ?? domElementGetter()
  el.dataset.buildVersion = __BUILD_VERSION__
  if (props.auth?.token) setAuthToken(props.auth.token)
  root = createRoot(el)
  root.render(<App />)
}

export const unmount = async (): Promise<void> => {
  root?.unmount()
  root = null
}
