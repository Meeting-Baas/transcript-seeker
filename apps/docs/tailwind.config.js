import { createPreset } from "fumadocs-ui/tailwind-plugin";
import baseConfig from "@meeting-baas/tailwind-config/web";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
    "./mdx-components.{ts,tsx}",
    "../../node_modules/fumadocs-ui/dist/**/*.js",
    "../../packages/ui/src/*.{ts,tsx}",
  ],
  presets: [
    createPreset({
      addGlobalColors: true,
      preset: "vitepress",
    }),
  ],
  plugins: [baseConfig.plugins, require("tailwindcss-animate")],
};
