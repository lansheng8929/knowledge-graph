import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV ?? "development",
    ),
    __BUILD_VERSION__: JSON.stringify("dev"),
  },
  plugins: [react()],
  server: {
    port: 3003,
    watch: { usePolling: true, interval: 100 },
    proxy: {
      "/api": { target: "http://localhost:8004", changeOrigin: true },
    },
  },
})
