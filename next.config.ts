import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'https://medisupply-backend.duckdns.org/:path*',
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
