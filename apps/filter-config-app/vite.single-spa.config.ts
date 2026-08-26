import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import fs from "node:fs"

// 共享依赖清单（react/react-dom 等）：运行时经 shell importmap 解析
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
      fileName: () => "filter-config-app.js",
    },
    rollupOptions: {
      external: [...sharedExternals],
      output: { exports: "named" },
    },
    cssCodeSplit: false,
    outDir: "dist-single-spa",
    sourcemap: false,
  },
})
