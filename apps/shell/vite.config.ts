import { defineConfig } from "vite"
import path from "path"

// Single-SPA 主应用壳（root-config）
export default defineConfig({
  define: {
    // dev 模式下 shell 直接编译 graph-app 源码，需提供其全局版本标记
    __BUILD_VERSION__: JSON.stringify("dev"),
  },
  resolve: {
    alias: {
      // 渲染引擎（子应用 graph-app 亦引用，保持一致）
      "@lansheng/knowledge-graph": path.resolve(__dirname, "../../graph/src"),
    },
  },
  build: {
    rollupOptions: {
      // T2.3.4：graph-app 由浏览器经原生 importmap 解析（index.html），
      // 打包时不解析该动态 import，运行时才按 importmap 加载
      external: ["graph-app"],
    },
  },
  server: {
    port: 3001,
    proxy: {
      // T4.1.1：登录签发 token；目标可用环境变量覆盖（容器化 dev 指向 kg-dev-auth）
      "/api/v1/auth": {
        target: process.env.VITE_AUTH_PROXY ?? "http://localhost:8004",
        changeOrigin: true,
      },
      "/api": {
        // 容器化 dev 用 VITE_PROXY_TARGET 指向 kg-dev-query
        target: process.env.VITE_PROXY_TARGET ?? "http://localhost:8001",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 3001,
    proxy: {
      // 生产预览走网关统一出口（后端在容器内，host 无 8001）
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
})
