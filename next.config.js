/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            "game-assets.swgoh.gg",
            "4zs151.p3cdn1.secureserver.net"
        ],
    },
};

module.exports = nextConfig;
