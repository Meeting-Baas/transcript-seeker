import createBundleAnalyzer from "@next/bundle-analyzer";
import { createMDX } from "fumadocs-mdx/next";

const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});
const withMDX = createMDX();

// orama rest api
/** @type {import('next').NextConfig} */

const config = {
  output: "export",
  reactStrictMode: true,
  eslint: {
    // Replaced by root workspace command
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["ts-morph", "typescript"],
  images: {
    unoptimized: true,
  },
};

export default withAnalyzer(withMDX(config));
