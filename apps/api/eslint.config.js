import baseConfig from "@meeting-baas/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    // todo: use build dir
    ignores: [".nitro/**", ".output/**"],
  },
  ...baseConfig,
];
