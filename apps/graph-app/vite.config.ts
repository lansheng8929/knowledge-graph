import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV ?? "development",
    ),
    // T2.3.4：dev / 独立构建时的版本标记（单模块构建由 publish 脚本注入真实版本）
    __BUILD_VERSION__: JSON.stringify("dev"),
  },
  resolve: {
    alias: {
      "@lansheng/knowledge-graph": path.resolve(__dirname, "../../graph/src"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".frag": "text",
        ".vert": "text",
      },
    },
  },
  plugins: [react()],
  server: {
    port: 3000,
    watch: {
      // 容器化 dev：Docker Desktop 不转发 host 文件事件 → 轮询保证 HMR
      usePolling: true,
      interval: 100,
    },
    proxy: {
      "/api": {
        target: "http://localhost:8001",
        changeOrigin: true,
      },
    },
  },
})
