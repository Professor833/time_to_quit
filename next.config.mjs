/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Configure for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/canIQuit' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
