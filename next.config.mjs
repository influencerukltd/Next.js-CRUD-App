/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Force clean build - no Prisma in this project
  experimental: {
    // Using Neon serverless driver directly
  },
};

export default nextConfig;
