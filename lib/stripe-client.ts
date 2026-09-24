import { loadStripe, type Stripe } from "@stripe/stripe-js";

let promise: Promise<Stripe | null> | null = null;

/**
 * 前端 Stripe 实例（整个页面共用一个）。
 * 构建时写进了 NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 就直接用；否则运行时向 /api/stripe/config 读取。
 */
export function getStripePromise(): Promise<Stripe | null> {
    if (!promise) {
        const buildKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        promise = buildKey
            ? loadStripe(buildKey)
            : fetch("/api/stripe/config")
                  .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`Stripe config ${r.status}`))))
                  .then((d: { publishableKey: string }) => loadStripe(d.publishableKey))
                  .catch((err) => {
                      promise = null; // 下次重试
                      throw err;
                  });
    }
    return promise;
}
