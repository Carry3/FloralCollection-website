import Stripe from 'stripe';

// 不锁定 apiVersion —— 使用 SDK 内置的版本，避免与类型定义漂移。
// 用 fetch 发请求：Cloudflare Workers 上没有 Node 的 http 模块实现（Node 环境同样可用）。
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    httpClient: Stripe.createFetchHttpClient(),
});

/** Webhook 签名校验用 Web Crypto（Workers 与 Node 通用） */
export const stripeCryptoProvider = Stripe.createSubtleCryptoProvider();
