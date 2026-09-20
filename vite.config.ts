import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/calcstack/',
  plugins: [
    inspectAttr(),
    react(),
    {
      name: 'root-to-base-redirect',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/') {
            res.statusCode = 302
            res.setHeader('Location', '/calcstack/')
            res.end()
            return
          }
          next()
        })
      },
    },
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
