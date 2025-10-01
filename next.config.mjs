// next.config.mjs
import path from 'path'; // Import path module

/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        removeConsole: process.env.NODE_ENV === "production", // Optional but recommended: removes all console.* calls in production builds.
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.mangabaka.dev',
            },
            {
                protocol: 'https',
                hostname: 'mangadex.org',
            },
            {
                protocol: 'https',
                hostname: 's4.anilist.co',
            }
        ],
    },
    transpilePackages: ['@auth/next'],
    webpack: (config, { isServer }) => {
        // Add a custom alias for @auth/next/react
        config.resolve.alias['@auth/next/react'] = path.resolve(
            process.cwd(),
            'node_modules/@auth/next/react'
        );
        return config;
    },
};

export default nextConfig;