import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: '/mission-control-korean',
  assetPrefix: '/mission-control-korean',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
