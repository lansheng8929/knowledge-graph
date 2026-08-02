/**
 * 声明「graph-app」为 importmap 提供的模块（T2.3.4）。
 *
 * 生产构建时 shell 用 import("graph-app") 经原生 importmap 加载独立子应用产物；
 * 打包器（rollup）不解析该字符串（见 main.ts 的 @vite-ignore），运行时由浏览器按
 * index.html 中 <script type="importmap"> 的映射解析。此处仅提供类型。
 */

import type { LifeCycles } from "single-spa"

declare module "graph-app" {
  export const bootstrap: LifeCycles["bootstrap"]
  export const mount: LifeCycles["mount"]
  export const unmount: LifeCycles["unmount"]
  export const domElementGetter: () => HTMLElement
  const lifecycles: LifeCycles
  export default lifecycles
}
