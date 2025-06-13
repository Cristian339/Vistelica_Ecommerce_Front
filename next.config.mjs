/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    // Elimina exportPathMap - no es compatible con App Router
    async rewrites() {
        return [
            {
                source: '/product-detail/page/:id',
                destination: '/product-detail/page?id=:id'
            }
        ]
    }
}

export default nextConfig;