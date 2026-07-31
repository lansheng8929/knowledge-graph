import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV ?? "development",
    ),
  },
  resolve: {
    alias: {
      "@lansheng/knowledge-graph": path.resolve(__dirname, "../graph/src"),
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
    proxy: {
      "/api": {
        target: "http://localhost:8001",
        changeOrigin: true,
      },
    },
  },
})
