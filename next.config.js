/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enables static exports for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  // Ensure the basePath is set if your site is not hosted at the root of the domain
  // basePath: '/bikininjas.github.io',
};

module.exports = nextConfig;
