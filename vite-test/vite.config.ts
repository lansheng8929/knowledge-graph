import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@ra-sdk/knowledge-graph": path.resolve(__dirname, "../graph"),
    },
  },
  server: {
    port: 3000,
  },
})
