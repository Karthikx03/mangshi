import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    port: 5173,
    // In development, the Express API runs separately on :5050; proxy /api to it so the
    // client can always call relative /api/... URLs (same as in production).
    proxy: {
      "/api": process.env.VITE_API_PROXY ?? "http://localhost:5050",
    },
  },
});
