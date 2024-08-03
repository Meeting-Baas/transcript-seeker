import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';
import path, { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '../'));
  // Load the .env file from the parent directory
  dotenv.config({ path: resolve(__dirname, '../.env') });

  const MEETINGBASS_API_URL = env.VITE_MEETINGBASS_API_URL;
  const MEETINGBASS_S3_URL = env.VITE_MEETINGBASS_S3_URL;
  const VITE_SERVER_API_URL = env.VITE_SERVER_API_URL;
  const VITE_BAAS_PROXY_URL = env.VITE_BAAS_PROXY_URL;
  const VITE_DEEPGRAM_PROXY_URL = env.VITE_DEEPGRAM_PROXY_URL || 'https://api.deepgram.com';
  const VITE_S3_PROXY_URL = env.VITE_S3_PROXY_URL;
  const HOST = env.HOST;
  const PORT = env.PORT;

  return {
    base: './',
    plugins: [
      react(),
      checker({
        typescript: true,
      }),
    ],
    server: {
      proxy: {
        [`${VITE_SERVER_API_URL}`]: {
          target: `http://${HOST}:${PORT}`,
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        },
        [`${VITE_BAAS_PROXY_URL}`]: {
          target: MEETINGBASS_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${VITE_BAAS_PROXY_URL}`), ''),
          secure: true,
        },
        [`${VITE_DEEPGRAM_PROXY_URL}`]: {
          target: VITE_DEEPGRAM_PROXY_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${VITE_DEEPGRAM_PROXY_URL}`), ''),
          secure: true,
        },
        [`${VITE_S3_PROXY_URL}`]: {
          target: MEETINGBASS_S3_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${VITE_S3_PROXY_URL}`), ''),
          secure: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@meeting-baas/shared': path.resolve(__dirname, '../packages/shared/src'),
      },
    },
  };
});
