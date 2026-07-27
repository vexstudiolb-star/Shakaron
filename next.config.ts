import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Enable Next.js image resizing for mobile — R2 + Unsplash
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pub-799a82dae4e94cb4ae65b0944f972484.r2.dev",
      },
      {
        protocol: "https",
        hostname: "pub-1536ea98cc6e479d90787c210c38c6fb.r2.dev",
      },
    ],
  },
};

export default nextConfig;
