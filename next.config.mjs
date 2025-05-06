/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com'],
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