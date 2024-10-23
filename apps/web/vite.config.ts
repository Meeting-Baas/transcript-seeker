import path from 'path';
import { defineConfig } from 'vite';
import replace from '@rollup/plugin-replace';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';

// @ts-ignore
export default defineConfig(() => {
  const CLIENT_PORT: number = Number(process.env.VITE_CLIENT_PORT) || 5173;
  const CLIENT_HOST: string = process.env.VITE_CLIENT_HOST || 'localhost';

  return {
    base: './',
    plugins: [
      react(),
      checker({
        typescript: true,
      })
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
