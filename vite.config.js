import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["pwa2-192x192.png", "pwa2-512x512.png"],
      manifest: {
        name: "SWINGS",
        short_name: "SWINGS",
        description: "골프 그룹 매칭 서비스",
        theme_color: "#ffffff",
        start_url: "/swings",
        display: "standalone",
        background_color: "#ffffff",
        icons: [
          {
            src: "/pwa2-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa2-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: true, // ✅ 개발 중 캐시 비활성화
      },
    }),
  ],
  define: {
    global: "globalThis",
  },
  css: {
    postcss: "./postcss.config.js",
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
});
