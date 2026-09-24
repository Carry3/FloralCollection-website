import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Cloudflare Workers：pg-cloudflare（Postgres 在 Workers 上的连接实现）与 jose 保持外部引用，
    // 与 Payload 官方 with-cloudflare 模板一致
    serverExternalPackages: ["jose", "pg-cloudflare"],
    // 开发阶段用 Cloudflare 临时隧道（cloudflared tunnel --url http://localhost:3000）给客户看效果：
    // Next.js 开发模式默认拦截其他域名的开发资源请求，这里放行（只影响 npm run dev，线上无影响）
    allowedDevOrigins: ["*.trycloudflare.com"],
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
