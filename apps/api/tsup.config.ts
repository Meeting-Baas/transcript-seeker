import path from "path";
import fs from "fs";

import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "functions",
  onSuccess: async () => {
    console.log('copying .env.development.local to functions')
    try {
      const source = path.join(__dirname, ".env.development.local");
      const destination = path.join(__dirname, "functions", ".env");
      fs.copyFileSync(source, destination);
      console.log(".env.development.local was copied successfully!");
    } catch (error) {
      console.error("failed to copy .env.development.local:", error);
    }
  },
});
