import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion", "gsap"],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
