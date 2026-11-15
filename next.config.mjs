/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/smm-content-studio' : '',
  assetPrefix: isProd ? '/smm-content-studio/' : '',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
