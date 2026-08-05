/**
 * graph-app 的 Single-SPA 生命周期入口（T2.3.1）。
 *
 * 作为子应用被 apps/shell 注册加载；独立运行时仍走 main.tsx（不受影响）。
 * 契约：bootstrap / mount / unmount。
 */

import { createRoot, type Root } from "react-dom/client"
import App from "./App"
import { ThemeProvider } from "./hooks/useTheme"
import { setAuthToken } from "./api/client"
// 子应用作为 single-spa 挂载时也必须加载主题 token 与工具类
// （独立运行时由 main.tsx import，二者必须一致，否则面板背景/边框变量缺失）
// 主题 token 单一来源（壳层 shell 持有，所有子模块读取）
import "../../shell/src/styles/tokens.css"
import "./styles/utilities.css"

let root: Root | null = null

/** single-spa 约定：提供挂载容器（不存在则自动创建）。 */
export const domElementGetter = (): HTMLElement => {
  let el = document.getElementById("single-spa-application:graph-app")
  if (!el) {
    el = document.createElement("div")
    el.id = "single-spa-application:graph-app"
    document.body.appendChild(el)
  }
  return el
}

export const bootstrap = async (): Promise<void> => {
  // 子应用初始化（预留：可做预加载等）
}

export const mount = async (props: {
  domElement?: HTMLElement
  auth?: { token?: string; tenantId?: string }
  [key: string]: unknown
}): Promise<void> => {
  const el = props.domElement ?? domElementGetter()
  // T2.3.4 演示标记：标注当前构建版本（单模块更新时通过它确认加载的是哪个版本产物）
  el.dataset.buildVersion = __BUILD_VERSION__
  // T2.3.3：壳层注入的 token 写入 API 客户端（Phase 4 接 IDP 后携带真 token）
  if (props.auth?.token) setAuthToken(props.auth.token)
  root = createRoot(el)
  root.render(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
  )
}

export const unmount = async (): Promise<void> => {
  root?.unmount()
  root = null
}
