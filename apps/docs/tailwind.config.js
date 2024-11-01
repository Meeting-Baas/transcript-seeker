import { createPreset, presets } from "fumadocs-ui/tailwind-plugin";
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
      preset: {
        ...presets.default,
        dark: {
          ...presets.default.dark,
          background: '0 0% 17%',
          foreground: ' 0 0% 100%',
          popover: '0 0% 17%',
          card: '0 0% 17%',
          muted: '173 8% 22%',
          border: '173 8% 22%',
          accent: '173 8% 22%',
          'accent-foreground': '0 0% 100%',
          'muted-foreground': '0 0% 65%',
        },
      }
    }),
  ],
  plugins: [require("tailwindcss-animate")],
};
