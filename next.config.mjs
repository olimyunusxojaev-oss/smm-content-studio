/** @type {import('next').NextConfig} */
const isGithubPages = Boolean(process.env.GITHUB_PAGES);

const nextConfig = {
  output: isGithubPages ? 'export' : undefined,
  basePath: isGithubPages ? '/smm-content-studio' : '',
  assetPrefix: isGithubPages ? '/smm-content-studio/' : undefined,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
