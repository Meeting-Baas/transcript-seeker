import baseConfig from '@meeting-baas/eslint-config/base';
import reactConfig from '@meeting-baas/eslint-config/react';

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['dist/**'],
  },
  ...baseConfig,
  ...reactConfig,
];
