import path, { resolve } from 'path';
import type { VitePWAOptions } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import replace from '@rollup/plugin-replace';
import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';
import checker from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa';

dotenv.config({ path: resolve(__dirname, '../../.env') });

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
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
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
  pwaOptions.injectManifest = {
    minify: false,
    enableWorkboxModulesLogs: true,
    maximumFileSizeToCacheInBytes: 11000000,
  };
}

if (reload) {
  // @ts-expect-error just ignore
  replaceOptions.__RELOAD_SW__ = 'true';
}

if (selfDestroying) pwaOptions.selfDestroying = selfDestroying;

export default defineConfig(() => {
  const CLIENT_PORT: number = Number(process.env.VITE_CLIENT_PORT) || 5173;
  const CLIENT_HOST: string = process.env.VITE_CLIENT_HOST || 'localhost';

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
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@meeting-baas/ui': path.resolve(__dirname, '../../packages/ui/src'),
      },
    },
    optimizeDeps: { exclude: ['@electric-sql/pglite', '@meeting-baas/ui'] },
  };
});
