/**
 * graph-app 子应用独立构建（T2.3.4 前端单模块更新 + 共享依赖）
 *
 * 把 Single-SPA 生命周期（src/single-spa.tsx）打成 ESM 产物（format: es），
 * 供 shell 通过原生 importmap 远程加载：
 *   - 共享依赖（react/react-dom/scheduler）external 不打包 → ESM 裸说明符导入，
 *     运行时由 importmap 解析（单一实例、单一下载）
 *   - CSS 内联 → 单文件可托管到任意静态服务器 / CDN
 *   - 产物按版本分发（scripts/publish-graph-app.sh），shell 切版本即可单模块更新/回滚
 *
 * 用法：
 *   bun run --cwd apps/graph-app build:single-spa     # 产物 → dist-single-spa/graph-app.js
 *   bash scripts/publish-graph-app.sh 0.1.0           # 构建并按版本发布到 shell/public/subapps/
 */

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import fs from "node:fs"

// 共享依赖清单（由 scripts/detect-shared-deps.mjs 自动生成）：
// 这些依赖不打包，运行时经 shell importmap 解析（只下载一次、单一实例）。
const sharedExternals: string[] = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../../shared/deps/shared-externals.json"),
    "utf8",
  ),
)

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
      // 共享依赖不打包（react/react-dom 等，rollup 对 external 条目按前缀匹配，
      // 自动覆盖 react-dom/client、react/jsx-runtime 等子路径）；运行时经 importmap 解析
      external: [...sharedExternals],
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
