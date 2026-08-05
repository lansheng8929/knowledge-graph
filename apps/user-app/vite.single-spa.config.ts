import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// user-app 单模块构建（T2.3.4）：自包含 ESM bundle，经 importmap 远程加载
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
      external: [],
      output: { exports: "named" },
    },
    cssCodeSplit: false,
    outDir: "dist-single-spa",
    sourcemap: false,
  },
})
