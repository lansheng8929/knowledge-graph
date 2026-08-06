/**
 * import-app 子应用独立构建（T2.3.4 前端单模块更新 + 共享依赖）
 *
 * 把 Single-SPA 生命周期（src/single-spa.tsx）打成 ESM 产物（format: es），
 * 供 shell 通过原生 importmap 远程加载（与 graph-app 同构）：
 *   - 共享依赖（react/react-dom）external 不打包 → ESM 裸说明符，运行时 importmap 解析
 *   - CSS 内联 → 单文件可托管到任意静态服务器 / CDN
 *   - 按版本分发（scripts/publish-import-app.sh），shell 切版本即可单模块更新/回滚
 */

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import fs from "node:fs"

// 共享依赖清单（由 scripts/detect-shared-deps.mjs 自动生成）：
// 不打包，运行时经 shell importmap 解析（只下载一次、单一实例）。
const sharedExternals: string[] = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../../shared/deps/shared-externals.json"),
    "utf8",
  ),
)

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
      // 共享依赖不打包（react/react-dom 等，按前缀匹配覆盖 react-dom/client 等子路径）
      external: [...sharedExternals],
      output: {
        exports: "named",
      },
    },
    cssCodeSplit: false,
    outDir: "dist-single-spa",
    sourcemap: false,
  },
})
