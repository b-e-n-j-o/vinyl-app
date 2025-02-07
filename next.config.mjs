/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
    },
    server: {
        port: parseInt(process.env.PORT, 10) || 8080,
        hostname: '0.0.0.0'
    },
    webpack: (config) => {
        config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', ...config.resolve.extensions];
        return config;
    }
}

export default nextConfig;