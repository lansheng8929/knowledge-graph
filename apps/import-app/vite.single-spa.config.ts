/**
 * import-app 子应用独立构建（T2.3.4 前端单模块更新）
 *
 * 把 Single-SPA 生命周期（src/single-spa.tsx）打成「自包含 ESM bundle」，
 * 供 shell 通过原生 importmap 远程加载（与 graph-app 同构）：
 *   - 不 external 依赖（react 全部打进单文件）→ importmap 只需映射 import-app 一个键
 *   - CSS 内联 → 单文件自包含，可放任意静态服务器
 *   - 按版本分发（scripts/publish-import-app.sh），shell 切版本即可单模块更新/回滚
 */

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    __BUILD_VERSION__: JSON.stringify(process.env.APP_VERSION || "dev"),
  },
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/single-spa.tsx"),
      formats: ["es"],
      fileName: () => "import-app.js",
    },
    rollupOptions: {
      // 自包含：显式关闭 external，把全部依赖打进单文件
      external: [],
      output: {
        exports: "named",
      },
    },
    cssCodeSplit: false,
    outDir: "dist-single-spa",
    sourcemap: false,
  },
})
