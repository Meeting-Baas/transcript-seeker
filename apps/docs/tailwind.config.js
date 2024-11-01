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
          background: '0 0% 17%',
          foreground: '0 0% 100%',
          card: '0 0% 17%',
          "card-foreground": "0 0% 100%",
          popover: '0 0% 17%',
          "popover-foreground": "0 0% 100%",
          primary: "176 100% 43%",
          "primary-foreground": "213 16% 27%",
          secondary: "173 8% 22%",
          "secondary-foreground": "0 0% 100%",
          muted: '173 8% 22%',
          "muted-foreground": "0 0% 65%",
          border: '173 8% 22%',
          accent: '173 8% 22%',
          'accent-foreground': '0 0% 100%',
          ring: "197 100% 44%"
        },
      }
    }),
  ],
  plugins: [require("tailwindcss-animate")],
};
