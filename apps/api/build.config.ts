
import path from "path";
import { defineBuildConfig } from "unbuild";
export default defineBuildConfig({
  outDir: "functions/server",
  entries: [
    // normal bundles
    './src/index',
    // file-to-file (please use .mts for all of your files), currently mkdist uncontrollably generates .d.ts and .d.mts based on the original extension: .ts or .mts
    // {
    //   builder: 'mkdist',
    //   input: './src/',
    //   esbuild: { minify: true },
    // },
  ],
  clean: true,
  //   declaration: true,
  declaration: false,
  sourcemap: true,
  alias: {
    "@": path.resolve(__dirname, "src"),
  },
  rollup: {
    esbuild: {
      minify: true,
    },
  },
  failOnWarn: false
});