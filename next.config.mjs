/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
    },
    webServer: {
        port: parseInt(process.env.PORT, 10) || 8080,
        hostname: '0.0.0.0'
    }
}
export default nextConfig;