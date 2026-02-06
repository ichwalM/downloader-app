import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "p16-sign.tiktokcdn.com",
      },
      {
        protocol: "https",
        hostname: "p16-sign-va.tiktokcdn.com",
      },
      {
        protocol: "https",
        hostname: "p16-sign-useast2a.tiktokcdn.com",
      },
      {
        protocol: "https",
        hostname: "p16.tiktokcdn.com",
      },
      {
        protocol: "https",
        hostname: "p19-sign.tiktokcdn-us.com",
      },
    ],
  },
};

export default nextConfig;
