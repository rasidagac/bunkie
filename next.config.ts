import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "42zkrqfpvlu9uaa6.blob.vercel-storage.com",
        port: "",
        protocol: "https",
      },
      {
        hostname: "picsum.photos",
        port: "",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
