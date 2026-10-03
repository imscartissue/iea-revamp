import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    target: "es2022",
    cssMinify: "lightningcss",

    // Emit vendor code as separate chunks so the app shell stays small and
    // long-lived deps (React, router) are cached independently of app code.
    // See docs/06-PERFORMANCE.md.
    rollupOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: "react-vendor", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: "router", test: /node_modules[\\/]react-router/ },
            { name: "table", test: /node_modules[\\/]@tanstack/ },
          ],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
});
