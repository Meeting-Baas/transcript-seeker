import baseConfig, { restrictEnvAccess } from "@meeting-baas/eslint-config/base";
import nextjsConfig from "@meeting-baas/eslint-config/nextjs";
import reactConfig from "@meeting-baas/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [
      'dist',
      'node_modules',
      '.next/**',
      'out/',
      'next.config.mjs',
      'postcss.config.js',
    ],  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
  {
    rules: {
      'no-console': 'off',
      // for Fumadocs CLI
      'import/no-relative-packages': 'off',
    },
  }
];
