const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
    },
    webpack: (config) => {
        config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', ...config.resolve.extensions];
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.join(__dirname, 'src')
        };
        return config;
    }
}

module.exports = nextConfig;