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
    // Deshabilita SSG para componentes problemáticos
    exportPathMap: async function () {
        return {
            '/': { page: '/' },
            // No incluyas las páginas que fallan
        }
    },
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