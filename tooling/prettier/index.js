import { fileURLToPath } from 'url';

/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  printWidth: 100,
  singleQuote: true,
  endOfLine: 'auto',
  tailwindConfig: fileURLToPath(new URL('../../tooling/tailwind/web.ts', import.meta.url)),
  tailwindFunctions: ['cn', 'cva'],
  importOrder: [
    '<TYPES>',
    '^(react/(.*)$)|^(react$)',
    '^(vite/(.*)$)|^(vite$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '<TYPES>^@meeting-baas',
    '^@meeting-baas/(.*)$',
    '',
    '<TYPES>^[.|..|~]',
    '^~/',
    '^[../]',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '4.4.0',
  overrides: [
    {
      files: '*.json.hbs',
      options: {
        parser: 'json',
      },
    },
    {
      files: '*.js.hbs',
      options: {
        parser: 'babel',
      },
    },
  ],
};

export default config;
