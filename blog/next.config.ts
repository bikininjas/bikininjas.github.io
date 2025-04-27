import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.dexerto.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.reddit.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.redd.it',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
