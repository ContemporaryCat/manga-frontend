// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
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