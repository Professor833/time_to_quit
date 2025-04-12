/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Remove basePath for proper static export
  // basePath: process.env.NODE_ENV === 'production' ? '/canIQuit' : '',
};

export default nextConfig;
