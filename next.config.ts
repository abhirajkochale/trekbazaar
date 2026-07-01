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
        hostname: '*.supabase.co',
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/company/login',
        destination: '/partner/login',
        permanent: true,
      },
      {
        source: '/company/dashboard',
        destination: '/partner',
        permanent: true,
      },
      {
        source: '/company/treks',
        destination: '/partner/treks',
        permanent: true,
      },
      {
        source: '/company/departures',
        destination: '/partner/departures',
        permanent: true,
      },
      {
        source: '/company/bookings',
        destination: '/partner/bookings',
        permanent: true,
      },
      {
        source: '/company/profile',
        destination: '/partner/profile',
        permanent: true,
      },
      {
        source: '/company/settings',
        destination: '/partner/settings',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
