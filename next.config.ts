import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'hostaway-platform.s3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/listing',
        destination: '/listings',
        permanent: true,
      },
      {
        source: '/:lang/listing',
        destination: '/:lang/listings',
        permanent: true,
      },
      {
        source: '/listing/:id',
        destination: '/listings/:id',
        permanent: true,
      },
      {
        source: '/:lang/listing/:id',
        destination: '/:lang/listings/:id',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
