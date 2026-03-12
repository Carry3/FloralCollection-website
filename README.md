This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Listings page map

The [Listings](/listings) page uses [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript) via `@vis.gl/react-google-maps`. To show the map, add your API key to `.env.local`:

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to your key.
3. In [Google Cloud Console](https://console.cloud.google.com/), enable **Maps JavaScript API** for the project that owns the key.

Without the key, the Listings page still works but shows a placeholder message instead of the map.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Cloudflare (OpenNext)

在 Cloudflare 后台用 **Connect to Git**（Workers Builds）连接本仓库，无需在 GitHub 配置 secrets，Cloudflare 会自动处理认证。

**Settings → Build** 中配置：
- **Build command**：`npx opennextjs-cloudflare build`
- **Deploy command**：`npx wrangler deploy`（默认即可）

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
