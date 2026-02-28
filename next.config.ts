import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  }, images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yhmvfouigexsqnxccpah.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;