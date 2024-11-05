import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: true,
  bundle: true,
  minify: true,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ['esm'],
  outDir: 'dist',
});
