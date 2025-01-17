import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites () {
    return [
      {
        source: '/categories',
        destination: 'http://localhost:3333/categories', 
      },
      {
        source: '/accounts',
        destination: 'http://localhost:3333/accounts',
      },
      {
        source: '/credit-cards',
        destination: 'http://localhost:3333/credit-cards',
      },
      {
        source: '//transactions/register',
        destination: 'http://localhost:3333//transactions/register',
      },
    ];
  }
};

export default nextConfig;
