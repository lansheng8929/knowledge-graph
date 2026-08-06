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

// user-app 单模块构建（T2.3.4 + 共享依赖）：ESM 产物，经原生 importmap 加载
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
      fileName: () => "user-app.js",
    },
    rollupOptions: {
      // 共享依赖不打包（react/react-dom 等，按前缀匹配覆盖 react-dom/client 等子路径）
      external: [...sharedExternals],
      output: { exports: "named" },
    },
    cssCodeSplit: false,
    outDir: "dist-single-spa",
    sourcemap: false,
  },
})
