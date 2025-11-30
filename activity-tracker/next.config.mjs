/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    },
    // Optimize production builds
    swcMinify: true,
    // Enable React strict mode for better development
    reactStrictMode: true,
}

export default nextConfig
