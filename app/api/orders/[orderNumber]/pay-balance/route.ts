import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { cardFee } from '@/lib/booking'
import { balanceCents, findOrder, payloadClient, type PaymentRecord } from '@/lib/server/orders'
import { verifyOrderToken } from '@/lib/server/order-token'

/** 付尾款：凭订单签名 token 创建（或复用）尾款 PaymentIntent，金额 = 剩余套餐金额 + 2.5% 刷卡手续费 */
export async function POST(req: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params
  const { token } = await req.json().catch(() => ({ token: null }))

  const booking = await findOrder(orderNumber)
  if (!booking || !verifyOrderToken(booking.orderNumber, booking.customerEmail, token)) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
  const amountCents = balanceCents(booking)
  if (booking.status !== 'reserved' || amountCents <= 0) {
    return NextResponse.json({ error: 'This order has no balance due.' }, { status: 400 })
  }
  const feeCents = cardFee(amountCents)

  // 同一金额的尾款 PaymentIntent 若还未完成就复用，避免重复创建
  const payments: PaymentRecord[] = [...(booking.payments ?? [])]
  const open = payments.find((p) => p.kind === 'balance' && p.status === 'pending' && p.amountCents === amountCents)
  if (open) {
    const pi = await stripe.paymentIntents.retrieve(open.paymentIntentId)
    if (pi.status !== 'succeeded' && pi.status !== 'canceled') {
      return NextResponse.json({ clientSecret: pi.client_secret, amountCents, feeCents })
    }
  }

  const pi = await stripe.paymentIntents.create({
    amount: amountCents + feeCents,
    currency: 'usd',
    customer: booking.stripeCustomerId ?? undefined,
    receipt_email: booking.customerEmail,
    description: `${booking.packageName} — balance — ${booking.orderNumber}`,
    automatic_payment_methods: { enabled: true }, // TODO: 同 checkout，待客户确认付款方式
    metadata: { orderNumber: booking.orderNumber, kind: 'balance', amountCents: String(amountCents), feeCents: String(feeCents) },
  })
  payments.push({ kind: 'balance', status: 'pending', amountCents, feeCents, paymentIntentId: pi.id })
  const payload = await payloadClient()
  await payload.update({ collection: 'bookings', id: booking.id, overrideAccess: true, data: { payments } as never })

  return NextResponse.json({ clientSecret: pi.client_secret, amountCents, feeCents })
}
