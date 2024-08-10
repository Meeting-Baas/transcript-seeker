import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';
import path, { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig(({ mode }) => {
  dotenv.config({ path: resolve(__dirname, './.env') });
  const env = loadEnv(mode, path.resolve(__dirname, './'));

  const MEETINGBASS_API_URL: string = env.VITE_MEETINGBASS_API_URL;
  const MEETINGBASS_S3_URL: string = env.VITE_MEETINGBASS_S3_URL;
  const VITE_SERVER_API_URL: string = env.VITE_SERVER_API_URL;
  const VITE_BAAS_PROXY_URL: string = env.VITE_BAAS_PROXY_URL;
  const VITE_S3_PROXY_URL: string = env.VITE_S3_PROXY_URL;
  const VITE_CLIENT_PORT: number = Number(env.VITE_CLIENT_PORT) || 5173;
  const VITE_CLIENT_HOST: string = env.VITE_CLIENT_HOST || "localhost";

  // TODO : Remove this nasty stuff - Or must be prefixed by VITE_ if necessary
  const HOST = env.HOST;
  const PORT = env.PORT;

  return {
    base: '/transcript-seeker/', // use relative paths
    plugins: [
      react(),
      checker({
        typescript: true,
      }),
    ],
    server: {
      port: VITE_CLIENT_PORT,
      host: VITE_CLIENT_HOST,
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
