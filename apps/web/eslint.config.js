import baseConfig, { restrictEnvAccess } from '@meeting-baas/eslint-config/base';
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactPlugin from 'eslint-plugin-react';
import reactConfig from '@meeting-baas/eslint-config/react';

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['dist/**', 'dev-dist/**'],
  },
  ...baseConfig,
  ...reactConfig,
  ...restrictEnvAccess,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,

      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
  }
];
