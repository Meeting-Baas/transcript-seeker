// vite.config.ts
import path from "path";
import { defineConfig } from "file:///workspaces/transcript-seeker/node_modules/vite/dist/node/index.js";
import react from "file:///workspaces/transcript-seeker/node_modules/@vitejs/plugin-react-swc/index.mjs";
import checker from "file:///workspaces/transcript-seeker/node_modules/vite-plugin-checker/dist/esm/main.js";
var __vite_injected_original_dirname = "/workspaces/transcript-seeker/apps/web";
var vite_config_default = defineConfig(() => {
  const CLIENT_PORT = Number(process.env.VITE_CLIENT_PORT) || 5173;
  const CLIENT_HOST = process.env.VITE_CLIENT_HOST || "localhost";
  return {
    // fix: https://answers.netlify.com/t/failed-to-load-module-script-expected-a-javascript-module-script-but-the-server-responded-with-a-mime-type-of-text-html-strict-mime-type-checking-is-enforced-for-module-scripts-per-html-spec/122743/8
    plugins: [
      react(),
      checker({
        typescript: true
      })
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
    optimizeDeps: { exclude: ["@electric-sql/pglite", "@meeting-baas/ui"] }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvd29ya3NwYWNlcy90cmFuc2NyaXB0LXNlZWtlci9hcHBzL3dlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3dvcmtzcGFjZXMvdHJhbnNjcmlwdC1zZWVrZXIvYXBwcy93ZWIvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3dvcmtzcGFjZXMvdHJhbnNjcmlwdC1zZWVrZXIvYXBwcy93ZWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlcGxhY2UgZnJvbSAnQHJvbGx1cC9wbHVnaW4tcmVwbGFjZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcbmltcG9ydCBjaGVja2VyIGZyb20gJ3ZpdGUtcGx1Z2luLWNoZWNrZXInO1xuXG4vLyBAdHMtaWdub3JlXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKCkgPT4ge1xuICBjb25zdCBDTElFTlRfUE9SVDogbnVtYmVyID0gTnVtYmVyKHByb2Nlc3MuZW52LlZJVEVfQ0xJRU5UX1BPUlQpIHx8IDUxNzM7XG4gIGNvbnN0IENMSUVOVF9IT1NUOiBzdHJpbmcgPSBwcm9jZXNzLmVudi5WSVRFX0NMSUVOVF9IT1NUIHx8ICdsb2NhbGhvc3QnO1xuXG4gIHJldHVybiB7XG4gICAgLy8gZml4OiBodHRwczovL2Fuc3dlcnMubmV0bGlmeS5jb20vdC9mYWlsZWQtdG8tbG9hZC1tb2R1bGUtc2NyaXB0LWV4cGVjdGVkLWEtamF2YXNjcmlwdC1tb2R1bGUtc2NyaXB0LWJ1dC10aGUtc2VydmVyLXJlc3BvbmRlZC13aXRoLWEtbWltZS10eXBlLW9mLXRleHQtaHRtbC1zdHJpY3QtbWltZS10eXBlLWNoZWNraW5nLWlzLWVuZm9yY2VkLWZvci1tb2R1bGUtc2NyaXB0cy1wZXItaHRtbC1zcGVjLzEyMjc0My84XG4gICAgcGx1Z2luczogW1xuICAgICAgcmVhY3QoKSxcbiAgICAgIGNoZWNrZXIoe1xuICAgICAgICB0eXBlc2NyaXB0OiB0cnVlLFxuICAgICAgfSlcbiAgICBdLFxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogQ0xJRU5UX1BPUlQsXG4gICAgICBob3N0OiBDTElFTlRfSE9TVCxcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAgICdAbWVldGluZy1iYWFzL3VpJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uL3BhY2thZ2VzL3VpL3NyYycpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIG9wdGltaXplRGVwczogeyBleGNsdWRlOiBbJ0BlbGVjdHJpYy1zcWwvcGdsaXRlJywgJ0BtZWV0aW5nLWJhYXMvdWknXSB9LFxuICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9TLE9BQU8sVUFBVTtBQUNyVCxTQUFTLG9CQUFvQjtBQUU3QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxhQUFhO0FBSnBCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYSxNQUFNO0FBQ2hDLFFBQU0sY0FBc0IsT0FBTyxRQUFRLElBQUksZ0JBQWdCLEtBQUs7QUFDcEUsUUFBTSxjQUFzQixRQUFRLElBQUksb0JBQW9CO0FBRTVELFNBQU87QUFBQTtBQUFBLElBRUwsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLFFBQ04sWUFBWTtBQUFBLE1BQ2QsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsUUFDcEMsb0JBQW9CLEtBQUssUUFBUSxrQ0FBVyx1QkFBdUI7QUFBQSxNQUNyRTtBQUFBLElBQ0Y7QUFBQSxJQUNBLGNBQWMsRUFBRSxTQUFTLENBQUMsd0JBQXdCLGtCQUFrQixFQUFFO0FBQUEsRUFDeEU7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
