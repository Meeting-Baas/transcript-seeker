import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

import checker from 'vite-plugin-checker';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '../'));

  const MEETINGBASS_API_URL = env.VITE_MEETINGBASS_API_URL || 'https://api.meetingbaas.com';
  const MEETINGBASS_S3_URL =
    env.VITE_MEETINGBASS_S3_URL || 'https://s3.eu-west-3.amazonaws.com/bots-videos';
  const VITE_SERVER_API_URL = env.VITE_SERVER_API_URL || '/api'

  // https://vitejs.dev/config/
  return {
    base: './', // use relative paths
    plugins: [
      react(),
      checker({
        typescript: true,
      }),
    ],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3080',
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
        '/meetingbaas-api': {
          target: MEETINGBASS_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/meetingbaas-api/, ''),
          secure: true,
        },
        '/s3': {
          target: MEETINGBASS_S3_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/s3/, ''),
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
