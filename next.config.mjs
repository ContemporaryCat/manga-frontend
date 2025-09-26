// next.config.mjs
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
};

export default nextConfig;