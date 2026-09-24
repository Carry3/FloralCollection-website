import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe, stripeCryptoProvider } from '@/lib/stripe'
import { applyPaymentIntent } from '@/lib/server/orders'

/**
 * Stripe webhook：Stripe Dashboard → Webhooks 添加 endpoint `https://<域名>/api/stripe/webhook`，
 * 监听 payment_intent.succeeded / payment_intent.payment_failed / payment_intent.canceled，
 * 签名密钥写入 STRIPE_WEBHOOK_SECRET。本地调试：stripe listen --forward-to localhost:3000/api/stripe/webhook
 *
 * 付款是否成功以这里为准（记账、改订单状态、发确认邮件）；处理是幂等的，Stripe 重发不会重复记账。
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET not configured' }, { status: 500 })

  const signature = req.headers.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(await req.text(), signature, secret, undefined, stripeCryptoProvider)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (
    event.type === 'payment_intent.succeeded' ||
    event.type === 'payment_intent.payment_failed' ||
    event.type === 'payment_intent.canceled'
  ) {
    try {
      await applyPaymentIntent(event.data.object as Stripe.PaymentIntent)
    } catch (err) {
      console.error('[stripe webhook]', err)
      // 返回 500 让 Stripe 稍后重试
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
    }
  }
  return NextResponse.json({ received: true })
}
