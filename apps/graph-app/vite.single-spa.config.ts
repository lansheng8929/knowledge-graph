/**
 * graph-app 子应用独立构建（T2.3.4 前端单模块更新）
 *
 * 把 Single-SPA 生命周期（src/single-spa.tsx）打成「自包含 ESM bundle」，
 * 供 shell 通过原生 importmap 远程加载：
 *   - 不 external 依赖（react/d3/lucide 全部打进单文件）→ importmap 只需映射 graph-app 一个键
 *   - CSS 内联 → 产物是真正独立可托管的单文件，可放任意静态服务器 / CDN
 *   - 产物按版本分发（scripts/publish-graph-app.sh），shell 切版本即可单模块更新/回滚
 *
 * 用法：
 *   bun run --cwd apps/graph-app build:single-spa     # 产物 → dist-single-spa/graph-app.js
 *   bash scripts/publish-graph-app.sh 0.1.0           # 构建并按版本发布到 shell/public/subapps/
 */

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

/**
 * 说明：CSS 内联由 scripts/publish-graph-app.sh 在发布时完成（node 脚本注入 <style>），
 * 因为 Vite 内置 CSS 插件的 emit 时机晚于自定义 generateBundle/writeBundle，hook 方案不可靠。
 */

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    // 子应用构建版本（由 publish-graph-app.sh 以 APP_VERSION 注入）
    __BUILD_VERSION__: JSON.stringify(process.env.APP_VERSION || "dev"),
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@lansheng/knowledge-graph": path.resolve(__dirname, "../../graph/src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/single-spa.tsx"),
      formats: ["es"],
      fileName: () => "graph-app.js",
    },
    rollupOptions: {
      // 自包含：显式关闭 external，把全部依赖打进单文件
      external: [],
      output: {
        // 保留具名导出（bootstrap/mount/unmount/domElementGetter），importmap 加载后 import("graph-app") 可取
        exports: "named",
      },
    },
    cssCodeSplit: false,
    outDir: "dist-single-spa",
    sourcemap: false,
  },
})
