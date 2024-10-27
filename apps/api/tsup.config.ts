import { defineConfig } from "tsup";
import { copyFile } from "fs/promises";
import { join } from "path";

const copyFiles = async () => {
  try {
    await copyFile(
      join(__dirname, ".env.production.local"),
      join(__dirname, "functions", "server", ".env")
    );

    await copyFile(
      join(__dirname, "functions", "config", "package.json"),
      join(__dirname, "functions", "server", "package.json")
    );

    console.log("Files copied successfully!");
  } catch (error) {
    console.error("Failed to copy files:", error);
  }
};

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: true,
  bundle: true,
  // minify: true,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ['esm'],
  outDir: "functions/server",
  onSuccess: copyFiles,
  // external: ['better-auth']
});
