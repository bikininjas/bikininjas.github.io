/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure allowed development origins to prevent cross-origin warnings
  experimental: {
    allowedDevOrigins: [
      'http://localhost:3000', 
      'http://127.0.0.1:3000',
      'http://127.0.0.1:*',
      'http://localhost:*',
      'http://0.0.0.0:*'
    ],
  },
  // Optimize Fast Refresh
  webpack: (config, { dev, isServer }) => {
    // Only apply these optimizations in development
    if (dev) {
      // Reduce the number of times Fast Refresh needs to do a full reload
      config.optimization.splitChunks = {
        cacheGroups: {
          default: false,
          vendors: false,
        },
      };
    }
    return config;
  },
  // Configure for GitHub Pages
  output: 'export',
  // Disable image optimization since GitHub Pages doesn't support it
  images: {
    unoptimized: true,
  },
  // Configuration des packages à transpiler si nécessaire
  transpilePackages: [],
  // Set the base path if your repository is not using a custom domain
  // and if it's not at the root of your domain
  // basePath: '/bikininjas.github.io',
};

module.exports = nextConfig;
