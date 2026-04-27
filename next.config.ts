import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/uploads/media/**',
      },
    ],
  },
};

export default nextConfig;
