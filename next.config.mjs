import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            { source: "/trust", destination: "/", permanent: true },
            { source: "/tenants", destination: "/", permanent: true },
            { source: "/owners", destination: "/", permanent: true },
            { source: "/agents", destination: "/", permanent: true },
            { source: "/listings", destination: "/", permanent: true },
            { source: "/pricing", destination: "/", permanent: true },
            { source: "/services", destination: "/", permanent: true },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.prod.website-files.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
};

export default nextConfig;
