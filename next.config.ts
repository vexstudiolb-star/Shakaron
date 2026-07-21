import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pub-1536ea98cc6e479d90787c210c38c6fb.r2.dev",
      },
    ],
  },
};

export default nextConfig;
