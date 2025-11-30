/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // Enable optimized package imports for better tree-shaking
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dropdown-menu', '@radix-ui/react-dialog', 'date-fns'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Enable compression
  compress: true,
  // Optimize production builds
  productionBrowserSourceMaps: false,
  // Enable SWC minification for faster builds
  swcMinify: true,
}

module.exports = nextConfig
