import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const API_PORT = process.env.RATINGS_PORT || 8787;

// No secrets here. The API key is read by server.mjs and used only there, so
// the dev server never holds it and no build step can leak it into a bundle.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        harness: resolve(__dirname, "index.html"),
        game: resolve(__dirname, "game.html"),
      },
    },
  },
  server: {
    proxy: {
      "/api": { target: `http://localhost:${API_PORT}`, changeOrigin: true },
    },
  },
});
