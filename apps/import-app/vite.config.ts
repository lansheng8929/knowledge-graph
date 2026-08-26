import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// import-app 独立开发入口（常规路径经 shell 挂载，此配置仅用于独立调试）
export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV ?? "development",
    ),
    // T2.3.4：构建版本标记（独立构建由 publish 脚本注入真实版本）
    __BUILD_VERSION__: JSON.stringify("dev"),
  },
  plugins: [react()],
  server: {
    port: 3002,
    watch: {
      // 容器化 dev：Docker Desktop 不转发 host 文件事件 → 轮询保证 HMR
      usePolling: true,
      interval: 100,
    },
    proxy: {
      "/api/v1/filter-schema": {
        target: "http://localhost:8007",
        changeOrigin: true,
      },
      "/api": {
        target: "http://localhost:8005",
        changeOrigin: true,
      },
    },
  },
})
