import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Cloudflare Workers：pg-cloudflare（Postgres 在 Workers 上的连接实现）与 jose 保持外部引用，
    // 与 Payload 官方 with-cloudflare 模板一致
    serverExternalPackages: ["jose", "pg-cloudflare"],
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

export default withPayload(nextConfig);
