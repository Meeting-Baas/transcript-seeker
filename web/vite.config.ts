import dotenv from 'dotenv';
import react from '@vitejs/plugin-react-swc';
import path, { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';

import checker from 'vite-plugin-checker';

import type { ManifestOptions, VitePWAOptions } from 'vite-plugin-pwa';
import { VitePWA } from 'vite-plugin-pwa';
import replace from '@rollup/plugin-replace';

dotenv.config({ path: resolve(__dirname, '../.env') });

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  includeAssets: ['logo.svg'],
  registerType: 'autoUpdate',
  manifest: {
    name: 'Transcript Seeker',
    short_name: 'Transcript Seeker',
    theme_color: '#78FFF0',
    icons: [
      {
        src: 'pwa-192x192.png', // <== don't add slash, for testing
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa-512x512.png', // <== don't remove slash, for testing
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png', // <== don't add slash, for testing
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
  devOptions: {
    enabled: process.env.SW_DEV === 'true',
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: 'index.html',
  },
};

const replaceOptions = { __DATE__: new Date().toISOString() };
const reload = process.env.RELOAD_SW === 'true';
const selfDestroying = process.env.SW_DESTROY === 'true';

if (process.env.SW === 'true') {
  pwaOptions.srcDir = 'src';
  pwaOptions.filename = 'service-worker.ts';
  pwaOptions.strategies = 'injectManifest';
  // ;(pwaOptions.manifest as Partial<ManifestOptions>).name = 'PWA Inject Manifest'
  // ;(pwaOptions.manifest as Partial<ManifestOptions>).short_name = 'PWA Inject'
  pwaOptions.injectManifest = {
    minify: false,
    enableWorkboxModulesLogs: true,
  };
}

if (reload) {
  // @ts-expect-error just ignore
  replaceOptions.__RELOAD_SW__ = 'true';
}

if (selfDestroying) pwaOptions.selfDestroying = selfDestroying;

export default defineConfig(() => {
  const MEETINGBASS_API_URL = process.env.MEETINGBASS_API_URL;
  const MEETINGBASS_S3_URL = process.env.MEETINGBASS_S3_URL;
  const SERVER_API_URL = process.env.SERVER_API_URL;
  const BAAS_PROXY_URL = process.env.BAAS_PROXY_URL;
  const S3_PROXY_URL = process.env.S3_PROXY_URL;
  const CLIENT_PORT: number = Number(process.env.CLIENT_PORT) || 5173;
  const CLIENT_HOST: string = process.env.CLIENT_HOST || 'localhost';

  // TODO : Remove this nasty stuff - Or must be prefixed by  if necessary
  const HOST = process.env.HOST;
  const PORT = process.env.PORT;

  return {
    base: './',
    plugins: [
      react(),
      checker({
        typescript: true,
      }),
      VitePWA(pwaOptions),
      replace(replaceOptions),
    ],
    server: {
      port: CLIENT_PORT,
      host: CLIENT_HOST,
      // todo: replace with proxy server
      proxy: {
        [`${SERVER_API_URL}`]: {
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
        [`${BAAS_PROXY_URL}`]: {
          target: MEETINGBASS_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${BAAS_PROXY_URL}`), ''),
          secure: true,
        },
        [`${S3_PROXY_URL}`]: {
          target: MEETINGBASS_S3_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${S3_PROXY_URL}`), ''),
          secure: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@meeting-baas/shared': path.resolve(__dirname, '../packages/shared'),

      },
    },
    optimizeDeps: { exclude: ['@electric-sql/pglite'] },
  };
});
