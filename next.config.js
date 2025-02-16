import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export default nextConfig;