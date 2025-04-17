import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
      registerType: "autoUpdate",
      includeAssets: ["pwa3-192x192.png", "pwa3-512x512.png"],
      injectRegister: "auto",
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
            src: "/pwa3-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa3-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
        suppressWarnings: true,
      },
    }),
  ],
  define: { global: "globalThis" },
  css: { postcss: "./postcss.config.js" },
  optimizeDeps: {
    esbuildOptions: {
      define: { global: "globalThis" },
      plugins: [NodeGlobalsPolyfillPlugin({ process: true, buffer: true })],
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
