import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getPackage } from '@/lib/packages'
import {
  AGREEMENT_VERSION,
  EVENT_TIMES,
  MAX_EVENTS_PER_DAY,
  balanceDueDate,
  depositAllowed,
  minEventDate,
  quote,
  type PaymentPlan,
} from '@/lib/booking'
import { generateOrderNumber } from '@/lib/server/order-number'
import { countReservedOn, payloadClient } from '@/lib/server/orders'
import { clientIp, rateLimit } from '@/lib/server/rate-limit'

const str = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

/**
 * 在线预订：校验 → 建订单（待付款）→ 创建 Stripe PaymentIntent，返回 clientSecret 给前端支付表单。
 * 价格、手续费全部以服务端 lib/packages + lib/booking 为准，不信任客户端传来的金额。
 */
export async function POST(req: Request) {
  const ip = clientIp(req)
  if (!rateLimit(`checkout:${ip}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many attempts. Please wait a few minutes and try again.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const pkg = getPackage(str(body.packageId, 40))
    if (!pkg) return NextResponse.json({ error: 'Unknown package' }, { status: 400 })

    const customerName = str(body.customerName, 120)
    const customerEmail = str(body.customerEmail, 200).toLowerCase()
    const customerPhone = str(body.customerPhone, 40)
    const eventDate = str(body.eventDate, 10)
    const eventTime = str(body.eventTime, 20)
    const venueName = str(body.venueName, 160)
    const venueAddress = str(body.venueAddress, 300)
    const notes = str(body.notes, 2000)
    const signatureName = str(body.signatureName, 120)
    const plan: PaymentPlan = body.paymentPlan === 'full' ? 'full' : 'deposit'

    const errors: string[] = []
    if (customerName.length < 2) errors.push('Please enter your full name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) errors.push('Please enter a valid email address.')
    if (customerPhone.replace(/\D/g, '').length < 7) errors.push('Please enter a phone number.')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate) || eventDate < minEventDate()) errors.push(`Please choose an event date on or after ${minEventDate()}.`)
    if (!EVENT_TIMES.includes(eventTime)) errors.push('Please choose an event start time.')
    if (venueAddress.length < 5) errors.push('Please enter the venue address.')
    if (body.agreementAccepted !== true || signatureName.length < 2) errors.push('Please read the rental agreement, check the box and type your full name to sign.')
    if (plan === 'deposit' && eventDate && !depositAllowed(eventDate)) errors.push('Your event is too soon for a deposit — the full amount is due at booking.')
    if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 })

    // 档期：同一天已锁定的场次达到上限就不能在线预订（仍可通过咨询联系）
    if ((await countReservedOn(eventDate)) >= MAX_EVENTS_PER_DAY) {
      return NextResponse.json(
        { error: 'Sorry — that date is fully booked online. Please contact us and we will do our best to accommodate you.' },
        { status: 409 }
      )
    }

    const q = quote(pkg, plan)
    const orderNumber = generateOrderNumber()

    const existing = await stripe.customers.list({ email: customerEmail, limit: 1 })
    const customer =
      existing.data[0] ?? (await stripe.customers.create({ email: customerEmail, name: customerName, phone: customerPhone }))

    const kind = plan === 'full' ? 'full' : 'deposit'
    const pi = await stripe.paymentIntents.create(
      {
        amount: q.chargeCents,
        currency: 'usd',
        customer: customer.id,
        receipt_email: customerEmail,
        description: `${pkg.name} — ${kind === 'full' ? 'paid in full' : '50% deposit'} — ${orderNumber}`,
        // TODO: 付款方式暂时全部开放（含 Link、银行转账、Klarna 等），待客户确认是否只保留银行卡
        automatic_payment_methods: { enabled: true },
        metadata: { orderNumber, kind, packageId: pkg.id, amountCents: String(q.amountCents), feeCents: String(q.feeCents) },
      },
      { idempotencyKey: `checkout-${orderNumber}` }
    )

    const payload = await payloadClient()
    await payload.create({
      collection: 'bookings',
      overrideAccess: true,
      data: {
        orderNumber,
        status: 'pending_payment',
        customerName,
        customerEmail,
        customerPhone,
        packageId: pkg.id,
        packageName: pkg.name,
        packagePrice: pkg.price,
        eventDate,
        eventTime,
        balanceDueDate: plan === 'deposit' ? balanceDueDate(eventDate) : null,
        venueName,
        venueAddress,
        notes,
        paymentPlan: plan,
        totalCents: q.totalCents,
        paidCents: 0,
        stripeCustomerId: customer.id,
        payments: [{ kind, status: 'pending', amountCents: q.amountCents, feeCents: q.feeCents, paymentIntentId: pi.id }],
        agreement: { signatureName, version: AGREEMENT_VERSION, acceptedAt: new Date().toISOString(), ipAddress: ip },
      } as never,
    })

    return NextResponse.json({ clientSecret: pi.client_secret, orderNumber, quote: q })
  } catch (error) {
    console.error('[checkout]', error)
    return NextResponse.json({ error: 'We could not start the payment. Please try again or contact us.' }, { status: 500 })
  }
}
