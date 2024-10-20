import baseConfig, { restrictEnvAccess } from "@meeting-baas/eslint-config/base";
import reactConfig from "@meeting-baas/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**", "dev-dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...restrictEnvAccess,
];