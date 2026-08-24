import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The RUN buttons post to /api/anthropic/v1/messages. This dev-only proxy adds
// the auth headers server-side, so ANTHROPIC_API_KEY never reaches the bundle.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/anthropic": {
        target: "https://api.anthropic.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/anthropic/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            const key = process.env.ANTHROPIC_API_KEY;
            if (key) proxyReq.setHeader("x-api-key", key);
            proxyReq.setHeader("anthropic-version", "2023-06-01");
          });
        },
      },
    },
  },
});
