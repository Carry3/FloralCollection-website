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

## Deploy on Cloudflare Workers（OpenNext + Payload）

网站（Next.js 16）+ 后台 / 订单数据库（Payload 3 + Postgres）+ Stripe 一起部署为一个 Cloudflare Worker。

### 前提
- **Workers 付费版（Workers Paid，$5/月）**：Worker 压缩后约 3.9 MB，超过免费版 3 MB 上限（付费版上限 10 MB）。与 Payload 官方 Cloudflare 模板的要求一致。
- 一个可从公网访问的 **Postgres**（如 Supabase）。强烈建议再在 Cloudflare 创建 **Hyperdrive** 连接池：
  Workers 不能跨请求复用数据库连接（`payload.config.ts` 中 `maxUses: 1`），不用 Hyperdrive 每次请求都要重新建立到数据库的连接，会明显变慢。

### 1. 数据库迁移（表结构）
表结构用 Payload 迁移管理（`migrations/`），开发模式也不会自动同步。
```bash
DATABASE_URI=<Supabase Session pooler 地址> npm run migrate   # 部署前 / 新数据库执行
npm run migrate:create <名字>                           # 修改了 collections/ 之后生成新迁移
```

### 2. Cloudflare Workers Builds（Connect to Git）
**Settings → Build**：
- **Build command**：`npx payload migrate && npx opennextjs-cloudflare build`
- **Deploy command**：`npx wrangler deploy`
- **Build variables**（构建时需要）：`DATABASE_URI`（Supabase **Session pooler**，端口 5432，用于迁移）、`PAYLOAD_SECRET`、`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`（`NEXT_PUBLIC_` 变量在构建时写进前端代码）

**Settings → Variables and Secrets**（运行时）：
`DATABASE_URI`（Supabase **Transaction pooler**，端口 6543）、`PAYLOAD_SECRET`、`STRIPE_SECRET_KEY`、`STRIPE_WEBHOOK_SECRET`、`RESEND_API_KEY`、`EMAIL_FROM`、`ADMIN_EMAIL`、`SITE_URL`、`CRON_SECRET`、`ORDER_LINK_SECRET`（说明见 `.env.example`）

### 3. 部署后
- **Stripe** → Webhooks：添加 `https://<域名>/api/stripe/webhook`，事件 `payment_intent.succeeded` / `payment_intent.payment_failed` / `payment_intent.canceled`，签名密钥填入 `STRIPE_WEBHOOK_SECRET`。
- **Resend**：验证发件域名（`EMAIL_FROM` 的域名）。
- **后台**：打开 `https://<域名>/admin` 创建第一个管理员账号。
- **尾款提醒**：Worker 自带 Cron Trigger（`wrangler.jsonc` → `triggers.crons`，每天 13:00 UTC），由 `cloudflare-worker.ts` 调用 `/api/cron/balance-reminders`，无需外部定时服务。

### 本地用 Cloudflare 运行时预览
```bash
npx opennextjs-cloudflare build
npx wrangler dev --test-scheduled      # 运行时变量放在 .dev.vars（已加入 .gitignore）
curl "http://localhost:8787/__scheduled?cron=0+13+*+*+*"   # 手动触发一次尾款提醒
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
