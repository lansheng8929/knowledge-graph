/** 数据导入模块——Single-SPA 生命周期入口。
 *
 * 作为子应用被 apps/shell 注册加载；独立运行时仍走 main.tsx（不受影响）。
 * 契约：bootstrap / mount / unmount。
 */

import { createRoot, type Root } from "react-dom/client"
import App from "./App"
import { setAuthToken } from "./api"
// 主题 token 单一来源（壳层 shell 持有，所有子模块读取）
import "../../shell/src/styles/tokens.css"
// 子应用作为 single-spa 挂载时也必须加载自己的样式
import "./styles.css"

let root: Root | null = null

/** single-spa 约定：提供挂载容器（不存在则自动创建）。 */
export const domElementGetter = (): HTMLElement => {
  let el = document.getElementById("single-spa-application:import-app")
  if (!el) {
    el = document.createElement("div")
    el.id = "single-spa-application:import-app"
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
  // T2.3.4 构建版本标记（单模块更新时确认加载的是哪个版本产物）
  el.dataset.buildVersion = __BUILD_VERSION__
  // T2.3.3：壳层注入的 token 写入 API 客户端（生产经网关 JWT 校验）
  if (props.auth?.token) setAuthToken(props.auth.token)
  root = createRoot(el)
  root.render(<App />)
}

export const unmount = async (): Promise<void> => {
  root?.unmount()
  root = null
}
