// vite.config.ts
import dotenv from "file:///workspaces/transcript-seeker/node_modules/.pnpm/dotenv@16.4.5/node_modules/dotenv/lib/main.js";
import react from "file:///workspaces/transcript-seeker/node_modules/.pnpm/@vitejs+plugin-react-swc@3.7.1_@swc+helpers@0.5.13_vite@5.4.9_@types+node@20.16.13_terser@5.36.0_/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path, { resolve } from "path";
import { defineConfig } from "file:///workspaces/transcript-seeker/node_modules/.pnpm/vite@5.4.9_@types+node@20.16.13_terser@5.36.0/node_modules/vite/dist/node/index.js";
import checker from "file:///workspaces/transcript-seeker/node_modules/.pnpm/vite-plugin-checker@0.7.2_eslint@9.13.0_jiti@1.21.6__optionator@0.9.4_typescript@5.6.3_vite@5_4z3ixxgyqzetcuvf5joeuhzq4q/node_modules/vite-plugin-checker/dist/esm/main.js";
import { VitePWA } from "file:///workspaces/transcript-seeker/node_modules/.pnpm/vite-plugin-pwa@0.20.5_@vite-pwa+assets-generator@0.2.6_vite@5.4.9_@types+node@20.16.13_terse_ng2bvseoavopddzjiqaxu3x7he/node_modules/vite-plugin-pwa/dist/index.js";
import replace from "file:///workspaces/transcript-seeker/node_modules/.pnpm/@rollup+plugin-replace@6.0.1_rollup@2.79.2/node_modules/@rollup/plugin-replace/dist/es/index.js";
var __vite_injected_original_dirname = "/workspaces/transcript-seeker/apps/web";
dotenv.config({ path: resolve(__vite_injected_original_dirname, "../.env") });
var pwaOptions = {
  mode: "development",
  base: "/",
  includeAssets: ["logo.svg"],
  registerType: "autoUpdate",
  manifest: {
    name: "Transcript Seeker",
    short_name: "Transcript Seeker",
    theme_color: "#78FFF0",
    icons: [
      {
        src: "pwa-192x192.png",
        // <== don't add slash, for testing
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/pwa-512x512.png",
        // <== don't remove slash, for testing
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "pwa-512x512.png",
        // <== don't add slash, for testing
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  },
  devOptions: {
    enabled: process.env.SW_DEV === "true",
    /* when using generateSW the PWA plugin will switch to classic */
    type: "module",
    navigateFallback: "index.html"
  }
};
var replaceOptions = { __DATE__: (/* @__PURE__ */ new Date()).toISOString() };
var reload = process.env.RELOAD_SW === "true";
var selfDestroying = process.env.SW_DESTROY === "true";
if (process.env.SW === "true") {
  pwaOptions.srcDir = "src";
  pwaOptions.filename = "service-worker.ts";
  pwaOptions.strategies = "injectManifest";
  pwaOptions.injectManifest = {
    minify: false,
    enableWorkboxModulesLogs: true
  };
}
if (reload) {
  replaceOptions.__RELOAD_SW__ = "true";
}
if (selfDestroying) pwaOptions.selfDestroying = selfDestroying;
var vite_config_default = defineConfig(() => {
  const CLIENT_PORT = Number(process.env.VITE_CLIENT_PORT) || 5173;
  const CLIENT_HOST = process.env.VITE_CLIENT_HOST || "localhost";
  return {
    base: "./",
    plugins: [
      react(),
      checker({
        typescript: false
      }),
      VitePWA(pwaOptions),
      replace(replaceOptions)
    ],
    server: {
      port: CLIENT_PORT,
      host: CLIENT_HOST
    },
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src"),
        "@meeting-baas/ui": path.resolve(__vite_injected_original_dirname, "../../packages/ui/src")
      }
    },
    optimizeDeps: { exclude: ["@electric-sql/pglite"] }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvd29ya3NwYWNlcy90cmFuc2NyaXB0LXNlZWtlci9hcHBzL3dlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3dvcmtzcGFjZXMvdHJhbnNjcmlwdC1zZWVrZXIvYXBwcy93ZWIvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3dvcmtzcGFjZXMvdHJhbnNjcmlwdC1zZWVrZXIvYXBwcy93ZWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgZG90ZW52IGZyb20gJ2RvdGVudic7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcbmltcG9ydCBwYXRoLCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xuXG5pbXBvcnQgY2hlY2tlciBmcm9tICd2aXRlLXBsdWdpbi1jaGVja2VyJztcblxuaW1wb3J0IHR5cGUgeyBNYW5pZmVzdE9wdGlvbnMsIFZpdGVQV0FPcHRpb25zIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnO1xuaW1wb3J0IHJlcGxhY2UgZnJvbSAnQHJvbGx1cC9wbHVnaW4tcmVwbGFjZSc7XG5cbmRvdGVudi5jb25maWcoeyBwYXRoOiByZXNvbHZlKF9fZGlybmFtZSwgJy4uLy5lbnYnKSB9KTtcblxuY29uc3QgcHdhT3B0aW9uczogUGFydGlhbDxWaXRlUFdBT3B0aW9ucz4gPSB7XG4gIG1vZGU6ICdkZXZlbG9wbWVudCcsXG4gIGJhc2U6ICcvJyxcbiAgaW5jbHVkZUFzc2V0czogWydsb2dvLnN2ZyddLFxuICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcbiAgbWFuaWZlc3Q6IHtcbiAgICBuYW1lOiAnVHJhbnNjcmlwdCBTZWVrZXInLFxuICAgIHNob3J0X25hbWU6ICdUcmFuc2NyaXB0IFNlZWtlcicsXG4gICAgdGhlbWVfY29sb3I6ICcjNzhGRkYwJyxcbiAgICBpY29uczogW1xuICAgICAge1xuICAgICAgICBzcmM6ICdwd2EtMTkyeDE5Mi5wbmcnLCAvLyA8PT0gZG9uJ3QgYWRkIHNsYXNoLCBmb3IgdGVzdGluZ1xuICAgICAgICBzaXplczogJzE5MngxOTInLFxuICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHNyYzogJy9wd2EtNTEyeDUxMi5wbmcnLCAvLyA8PT0gZG9uJ3QgcmVtb3ZlIHNsYXNoLCBmb3IgdGVzdGluZ1xuICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHNyYzogJ3B3YS01MTJ4NTEyLnBuZycsIC8vIDw9PSBkb24ndCBhZGQgc2xhc2gsIGZvciB0ZXN0aW5nXG4gICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICBwdXJwb3NlOiAnYW55IG1hc2thYmxlJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbiAgZGV2T3B0aW9uczoge1xuICAgIGVuYWJsZWQ6IHByb2Nlc3MuZW52LlNXX0RFViA9PT0gJ3RydWUnLFxuICAgIC8qIHdoZW4gdXNpbmcgZ2VuZXJhdGVTVyB0aGUgUFdBIHBsdWdpbiB3aWxsIHN3aXRjaCB0byBjbGFzc2ljICovXG4gICAgdHlwZTogJ21vZHVsZScsXG4gICAgbmF2aWdhdGVGYWxsYmFjazogJ2luZGV4Lmh0bWwnLFxuICB9LFxufTtcblxuY29uc3QgcmVwbGFjZU9wdGlvbnMgPSB7IF9fREFURV9fOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfTtcbmNvbnN0IHJlbG9hZCA9IHByb2Nlc3MuZW52LlJFTE9BRF9TVyA9PT0gJ3RydWUnO1xuY29uc3Qgc2VsZkRlc3Ryb3lpbmcgPSBwcm9jZXNzLmVudi5TV19ERVNUUk9ZID09PSAndHJ1ZSc7XG5cbmlmIChwcm9jZXNzLmVudi5TVyA9PT0gJ3RydWUnKSB7XG4gIHB3YU9wdGlvbnMuc3JjRGlyID0gJ3NyYyc7XG4gIHB3YU9wdGlvbnMuZmlsZW5hbWUgPSAnc2VydmljZS13b3JrZXIudHMnO1xuICBwd2FPcHRpb25zLnN0cmF0ZWdpZXMgPSAnaW5qZWN0TWFuaWZlc3QnO1xuICAvLyA7KHB3YU9wdGlvbnMubWFuaWZlc3QgYXMgUGFydGlhbDxNYW5pZmVzdE9wdGlvbnM+KS5uYW1lID0gJ1BXQSBJbmplY3QgTWFuaWZlc3QnXG4gIC8vIDsocHdhT3B0aW9ucy5tYW5pZmVzdCBhcyBQYXJ0aWFsPE1hbmlmZXN0T3B0aW9ucz4pLnNob3J0X25hbWUgPSAnUFdBIEluamVjdCdcbiAgcHdhT3B0aW9ucy5pbmplY3RNYW5pZmVzdCA9IHtcbiAgICBtaW5pZnk6IGZhbHNlLFxuICAgIGVuYWJsZVdvcmtib3hNb2R1bGVzTG9nczogdHJ1ZSxcbiAgfTtcbn1cblxuaWYgKHJlbG9hZCkge1xuICAvLyBAdHMtZXhwZWN0LWVycm9yIGp1c3QgaWdub3JlXG4gIHJlcGxhY2VPcHRpb25zLl9fUkVMT0FEX1NXX18gPSAndHJ1ZSc7XG59XG5cbmlmIChzZWxmRGVzdHJveWluZykgcHdhT3B0aW9ucy5zZWxmRGVzdHJveWluZyA9IHNlbGZEZXN0cm95aW5nO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKCkgPT4ge1xuICBjb25zdCBDTElFTlRfUE9SVDogbnVtYmVyID0gTnVtYmVyKHByb2Nlc3MuZW52LlZJVEVfQ0xJRU5UX1BPUlQpIHx8IDUxNzM7XG4gIGNvbnN0IENMSUVOVF9IT1NUOiBzdHJpbmcgPSBwcm9jZXNzLmVudi5WSVRFX0NMSUVOVF9IT1NUIHx8ICdsb2NhbGhvc3QnO1xuXG4gIHJldHVybiB7XG4gICAgYmFzZTogJy4vJyxcbiAgICBwbHVnaW5zOiBbXG4gICAgICByZWFjdCgpLFxuICAgICAgY2hlY2tlcih7XG4gICAgICAgIHR5cGVzY3JpcHQ6IGZhbHNlLFxuICAgICAgfSksXG4gICAgICBWaXRlUFdBKHB3YU9wdGlvbnMpLFxuICAgICAgcmVwbGFjZShyZXBsYWNlT3B0aW9ucyksXG4gICAgXSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHBvcnQ6IENMSUVOVF9QT1JULFxuICAgICAgaG9zdDogQ0xJRU5UX0hPU1RcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAgICdAbWVldGluZy1iYWFzL3VpJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uL3BhY2thZ2VzL3VpL3NyYycpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIG9wdGltaXplRGVwczogeyBleGNsdWRlOiBbJ0BlbGVjdHJpYy1zcWwvcGdsaXRlJ10gfSxcbiAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvUyxPQUFPLFlBQVk7QUFDdlQsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sUUFBUSxlQUFlO0FBQzlCLFNBQVMsb0JBQTZCO0FBRXRDLE9BQU8sYUFBYTtBQUdwQixTQUFTLGVBQWU7QUFDeEIsT0FBTyxhQUFhO0FBVHBCLElBQU0sbUNBQW1DO0FBV3pDLE9BQU8sT0FBTyxFQUFFLE1BQU0sUUFBUSxrQ0FBVyxTQUFTLEVBQUUsQ0FBQztBQUVyRCxJQUFNLGFBQXNDO0FBQUEsRUFDMUMsTUFBTTtBQUFBLEVBQ04sTUFBTTtBQUFBLEVBQ04sZUFBZSxDQUFDLFVBQVU7QUFBQSxFQUMxQixjQUFjO0FBQUEsRUFDZCxVQUFVO0FBQUEsSUFDUixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixhQUFhO0FBQUEsSUFDYixPQUFPO0FBQUEsTUFDTDtBQUFBLFFBQ0UsS0FBSztBQUFBO0FBQUEsUUFDTCxPQUFPO0FBQUEsUUFDUCxNQUFNO0FBQUEsTUFDUjtBQUFBLE1BQ0E7QUFBQSxRQUNFLEtBQUs7QUFBQTtBQUFBLFFBQ0wsT0FBTztBQUFBLFFBQ1AsTUFBTTtBQUFBLE1BQ1I7QUFBQSxNQUNBO0FBQUEsUUFDRSxLQUFLO0FBQUE7QUFBQSxRQUNMLE9BQU87QUFBQSxRQUNQLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxNQUNYO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFlBQVk7QUFBQSxJQUNWLFNBQVMsUUFBUSxJQUFJLFdBQVc7QUFBQTtBQUFBLElBRWhDLE1BQU07QUFBQSxJQUNOLGtCQUFrQjtBQUFBLEVBQ3BCO0FBQ0Y7QUFFQSxJQUFNLGlCQUFpQixFQUFFLFdBQVUsb0JBQUksS0FBSyxHQUFFLFlBQVksRUFBRTtBQUM1RCxJQUFNLFNBQVMsUUFBUSxJQUFJLGNBQWM7QUFDekMsSUFBTSxpQkFBaUIsUUFBUSxJQUFJLGVBQWU7QUFFbEQsSUFBSSxRQUFRLElBQUksT0FBTyxRQUFRO0FBQzdCLGFBQVcsU0FBUztBQUNwQixhQUFXLFdBQVc7QUFDdEIsYUFBVyxhQUFhO0FBR3hCLGFBQVcsaUJBQWlCO0FBQUEsSUFDMUIsUUFBUTtBQUFBLElBQ1IsMEJBQTBCO0FBQUEsRUFDNUI7QUFDRjtBQUVBLElBQUksUUFBUTtBQUVWLGlCQUFlLGdCQUFnQjtBQUNqQztBQUVBLElBQUksZUFBZ0IsWUFBVyxpQkFBaUI7QUFFaEQsSUFBTyxzQkFBUSxhQUFhLE1BQU07QUFDaEMsUUFBTSxjQUFzQixPQUFPLFFBQVEsSUFBSSxnQkFBZ0IsS0FBSztBQUNwRSxRQUFNLGNBQXNCLFFBQVEsSUFBSSxvQkFBb0I7QUFFNUQsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLFFBQ04sWUFBWTtBQUFBLE1BQ2QsQ0FBQztBQUFBLE1BQ0QsUUFBUSxVQUFVO0FBQUEsTUFDbEIsUUFBUSxjQUFjO0FBQUEsSUFDeEI7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsUUFDcEMsb0JBQW9CLEtBQUssUUFBUSxrQ0FBVyx1QkFBdUI7QUFBQSxNQUNyRTtBQUFBLElBQ0Y7QUFBQSxJQUNBLGNBQWMsRUFBRSxTQUFTLENBQUMsc0JBQXNCLEVBQUU7QUFBQSxFQUNwRDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
