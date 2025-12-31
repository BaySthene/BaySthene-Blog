import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'lodash'],
  },
  // Explicitly set the root to the current project directory using process.cwd()
  // This resolves the workspace root warning when multiple lockfiles are detected
  outputFileTracingRoot: process.cwd(),
};

export default withNextIntl(nextConfig);
