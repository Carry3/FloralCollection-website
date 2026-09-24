import Stripe from 'stripe';

let client: Stripe | null = null;

/**
 * 首次使用时才创建 Stripe 客户端：构建阶段（Cloudflare Workers Builds）没有 STRIPE_SECRET_KEY，
 * 若在模块加载时就 new Stripe('') 会直接抛错，导致整个构建失败。
 * 不锁定 apiVersion —— 使用 SDK 内置的版本，避免与类型定义漂移。
 * 用 fetch 发请求：Cloudflare Workers 上没有 Node 的 http 模块实现（Node 环境同样可用）。
 */
export function getStripe(): Stripe {
    if (!client) {
        const key = process.env.STRIPE_SECRET_KEY;
        if (!key) throw new Error('STRIPE_SECRET_KEY is not configured');
        client = new Stripe(key, { httpClient: Stripe.createFetchHttpClient() });
    }
    return client;
}

/** 与 Stripe 客户端用法相同（stripe.paymentIntents...），实际调用时才初始化 */
export const stripe = new Proxy({} as Stripe, {
    get: (_target, prop) => Reflect.get(getStripe(), prop),
});

/** Webhook 签名校验用 Web Crypto（Workers 与 Node 通用） */
export const stripeCryptoProvider = Stripe.createSubtleCryptoProvider();
