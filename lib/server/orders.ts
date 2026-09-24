import { getPayload } from 'payload'
import config from '@payload-config'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import {
  BALANCE_DUE_DAYS,
  CARD_FEE_RATE,
  ORDER_STATUS_LABEL,
  cardFee,
  formatCents,
  formatDateLong,
  todayDateOnly,
  type OrderStatus,
  type PaymentKind,
} from '@/lib/booking'
import { adminEmail, esc, layout, sendEmail } from './email'
import { orderLink } from './order-token'

export async function payloadClient() {
  return getPayload({ config })
}

export interface PaymentRecord {
  id?: string | null
  kind: PaymentKind
  status: 'pending' | 'succeeded' | 'failed'
  amountCents: number
  feeCents: number
  paidAt?: string | null
  paymentIntentId: string
}

export interface BookingDoc {
  id: number | string
  orderNumber: string
  status: OrderStatus
  customerName: string
  customerEmail: string
  customerPhone?: string | null
  packageId: string
  packageName: string
  packagePrice: number
  eventDate: string
  eventTime: string
  balanceDueDate?: string | null
  venueName?: string | null
  venueAddress: string
  notes?: string | null
  paymentPlan: 'deposit' | 'full'
  totalCents: number
  paidCents?: number | null
  payments?: PaymentRecord[] | null
  stripeCustomerId?: string | null
  agreement: { signatureName: string; version: string; acceptedAt: string; ipAddress?: string | null }
  emails?: { confirmationSentAt?: string | null; balanceReceiptSentAt?: string | null; lastReminderAt?: string | null; reminderCount?: number | null } | null
}

export async function findOrder(orderNumber: string): Promise<BookingDoc | null> {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'bookings',
    where: { orderNumber: { equals: orderNumber } },
    limit: 1,
    overrideAccess: true,
  })
  return (docs[0] as unknown as BookingDoc) ?? null
}

export function balanceCents(b: BookingDoc): number {
  return Math.max(0, b.totalCents - (b.paidCents ?? 0))
}

/** 前台可见的订单信息（不含 Stripe ID、IP 等内部字段） */
export function publicOrder(b: BookingDoc) {
  const balance = balanceCents(b)
  const canPayBalance = b.status === 'reserved' && balance > 0
  return {
    orderNumber: b.orderNumber,
    status: b.status,
    statusLabel: ORDER_STATUS_LABEL[b.status],
    customerName: b.customerName,
    packageId: b.packageId,
    packageName: b.packageName,
    eventDate: b.eventDate,
    eventTime: b.eventTime,
    venueName: b.venueName ?? '',
    venueAddress: b.venueAddress,
    totalCents: b.totalCents,
    paidCents: b.paidCents ?? 0,
    balanceCents: balance,
    balanceFeeCents: canPayBalance ? cardFee(balance) : 0,
    balanceDueDate: b.balanceDueDate ?? null,
    balanceOverdue: canPayBalance && !!b.balanceDueDate && b.balanceDueDate < todayDateOnly(),
    canPayBalance,
    payments: (b.payments ?? [])
      .filter((p) => p.status === 'succeeded')
      .map((p) => ({ kind: p.kind, amountCents: p.amountCents, feeCents: p.feeCents, paidAt: p.paidAt ?? null })),
    agreementSignedAt: b.agreement?.acceptedAt ?? null,
  }
}

export type PublicOrder = ReturnType<typeof publicOrder>

/**
 * 付款成功后的统一处理（Stripe webhook 与成功页都会调用；幂等，重复调用不会重复记账 / 发邮件）。
 * 只信任从 Stripe 服务端取回的 PaymentIntent，不信任客户端传来的状态。
 */
export async function applyPaymentIntent(pi: Stripe.PaymentIntent): Promise<BookingDoc | null> {
  const orderNumber = pi.metadata?.orderNumber
  const kind = pi.metadata?.kind as PaymentKind | undefined
  if (!orderNumber || !kind) return null

  const booking = await findOrder(orderNumber)
  if (!booking) return null

  const payments = [...(booking.payments ?? [])]
  const idx = payments.findIndex((p) => p.paymentIntentId === pi.id)
  if (idx === -1) return booking // 不是这张订单发起的付款
  const record = payments[idx]

  if (pi.status === 'succeeded') {
    if (record.status === 'succeeded') return booking // 已处理过
    payments[idx] = { ...record, status: 'succeeded', paidAt: new Date(pi.created * 1000).toISOString() }
    const paidCents = payments.filter((p) => p.status === 'succeeded').reduce((s, p) => s + p.amountCents, 0)
    const status: OrderStatus =
      booking.status === 'cancelled' || booking.status === 'completed'
        ? booking.status
        : paidCents >= booking.totalCents
          ? 'paid_in_full'
          : 'reserved'

    const payload = await payloadClient()
    const updated = (await payload.update({
      collection: 'bookings',
      id: booking.id,
      overrideAccess: true,
      data: { payments, paidCents, status } as never,
    })) as unknown as BookingDoc

    await sendPaymentEmails(updated, record.kind)
    return updated
  }

  if (pi.status === 'canceled' || pi.last_payment_error) {
    if (record.status === 'pending') {
      payments[idx] = { ...record, status: 'failed' }
      const payload = await payloadClient()
      return (await payload.update({
        collection: 'bookings',
        id: booking.id,
        overrideAccess: true,
        data: { payments } as never,
      })) as unknown as BookingDoc
    }
  }
  return booking
}

/* ═══════════════ 邮件 ═══════════════ */

function orderRows(b: BookingDoc): Array<[string, string]> {
  return [
    ['Order number', b.orderNumber],
    ['Package', `${b.packageName} (${formatCents(b.totalCents)})`],
    ['Event date', `${formatDateLong(b.eventDate)}, ${b.eventTime}`],
    ['Venue', [b.venueName, b.venueAddress].filter(Boolean).join(' — ')],
  ]
}

async function sendPaymentEmails(b: BookingDoc, kind: PaymentKind) {
  const link = orderLink(b.orderNumber, b.customerEmail)
  const payment = [...(b.payments ?? [])].reverse().find((p) => p.kind === kind && p.status === 'succeeded')
  const paidLine: [string, string] = [
    kind === 'balance' ? 'Balance paid' : kind === 'deposit' ? 'Deposit paid (50%, nonrefundable)' : 'Paid in full',
    payment ? `${formatCents(payment.amountCents + payment.feeCents)} (incl. ${formatCents(payment.feeCents)} card fee)` : '',
  ]
  const balance = balanceCents(b)

  const payload = await payloadClient()
  const emails = { ...(b.emails ?? {}) }

  if (kind === 'balance') {
    if (emails.balanceReceiptSentAt) return
    await sendEmail({
      to: b.customerEmail,
      subject: `Balance received — ${b.orderNumber}`,
      text: `Thank you, ${b.customerName}! Your balance for order ${b.orderNumber} has been received. Your ${b.packageName} is paid in full.\n\nView your order: ${link}`,
      html: layout({
        heading: 'Paid in full — thank you!',
        intro: `Hi ${esc(b.customerName)}, we've received your final payment. Your ${esc(b.packageName)} is now paid in full — all that's left is to enjoy your day.`,
        rows: [...orderRows(b), paidLine],
        cta: { label: 'View your order', href: link },
      }),
    })
    emails.balanceReceiptSentAt = new Date().toISOString()
  } else {
    if (emails.confirmationSentAt) return
    const balanceText =
      balance > 0 && b.balanceDueDate
        ? `The remaining balance of ${formatCents(balance)} (plus a ${CARD_FEE_RATE * 100}% card processing fee if paid by card) is due by ${formatDateLong(b.balanceDueDate)}. You can pay it any time from your order page.`
        : 'Your order is paid in full.'
    await sendEmail({
      to: b.customerEmail,
      subject: `Your date is reserved — Order ${b.orderNumber}`,
      text: [
        `Hi ${b.customerName},`,
        `Thank you for booking with The Floral Collection! Your wedding date is reserved.`,
        `Order number: ${b.orderNumber} (keep this — you'll use it with your email to check your order status)`,
        `Package: ${b.packageName}`,
        `Event: ${formatDateLong(b.eventDate)}, ${b.eventTime}`,
        balanceText,
        `View your order: ${link}`,
        `Our designer will reach out shortly to start planning your floral design.`,
      ].join('\n\n'),
      html: layout({
        heading: 'Your date is reserved',
        intro: `Hi ${esc(b.customerName)}, thank you for booking with us! Keep your order number — together with this email address it lets you check your order status any time, no account needed.`,
        rows: [...orderRows(b), paidLine, ...(balance > 0 && b.balanceDueDate ? ([['Balance due', `${formatCents(balance)} by ${formatDateLong(b.balanceDueDate)}`]] as Array<[string, string]>) : [])],
        cta: { label: 'View your order', href: link },
        footer: `${esc(balanceText)}<br>Our designer will reach out shortly to start planning your floral design. Delivery, setup & removal are included.`,
      }),
    })
    // 通知店家
    await sendEmail({
      to: adminEmail(),
      replyTo: b.customerEmail,
      subject: `New booking ${b.orderNumber} — ${b.packageName} — ${b.eventDate}`,
      text: [
        `New ${b.paymentPlan === 'full' ? 'paid-in-full' : 'deposit'} booking`,
        ...orderRows(b).map(([k, v]) => `${k}: ${v}`),
        `Customer: ${b.customerName} <${b.customerEmail}> ${b.customerPhone ?? ''}`,
        `Notes: ${b.notes ?? '—'}`,
        `Agreement signed by "${b.agreement.signatureName}" (v${b.agreement.version})`,
      ].join('\n'),
      html: layout({
        heading: 'New online booking',
        intro: `${esc(b.customerName)} &lt;${esc(b.customerEmail)}&gt; ${esc(b.customerPhone ?? '')}`,
        rows: [...orderRows(b), paidLine, ['Agreement signed by', b.agreement.signatureName]],
        footer: b.notes ? `Notes: ${esc(b.notes)}` : '',
      }),
    })
    emails.confirmationSentAt = new Date().toISOString()
  }

  await payload.update({ collection: 'bookings', id: b.id, overrideAccess: true, data: { emails } as never })
}

/** 尾款提醒邮件（cron 调用） */
export async function sendBalanceReminder(b: BookingDoc, overdue: boolean) {
  const balance = balanceCents(b)
  const fee = cardFee(balance)
  const link = orderLink(b.orderNumber, b.customerEmail)
  const due = b.balanceDueDate ? formatDateLong(b.balanceDueDate) : `${BALANCE_DUE_DAYS} days before your event`
  const ok = await sendEmail({
    to: b.customerEmail,
    subject: overdue ? `Balance overdue — Order ${b.orderNumber}` : `Balance due ${due} — Order ${b.orderNumber}`,
    text: `Hi ${b.customerName}, a friendly reminder that the remaining balance of ${formatCents(balance)} for order ${b.orderNumber} ${overdue ? 'was' : 'is'} due by ${due}. Pay online (card payments include a ${CARD_FEE_RATE * 100}% processing fee of ${formatCents(fee)}): ${link}`,
    html: layout({
      heading: overdue ? 'Your balance is overdue' : 'Your balance is coming due',
      intro: `Hi ${esc(b.customerName)}, a friendly reminder that the remaining balance for your ${esc(b.packageName)} ${overdue ? 'was' : 'is'} due by <strong>${esc(due)}</strong>.`,
      rows: [...orderRows(b), ['Balance', formatCents(balance)], [`Card processing fee (${CARD_FEE_RATE * 100}%)`, formatCents(fee)]],
      cta: { label: 'Pay balance', href: link },
      footer: 'Questions about your payment? Just reply to this email or give us a call.',
    }),
  })
  const payload = await payloadClient()
  await payload.update({
    collection: 'bookings',
    id: b.id,
    overrideAccess: true,
    data: { emails: { ...(b.emails ?? {}), lastReminderAt: new Date().toISOString(), reminderCount: (b.emails?.reminderCount ?? 0) + 1 } } as never,
  })
  return ok
}

/** 同一天已锁定的活动数（用于档期上限） */
export async function countReservedOn(eventDate: string): Promise<number> {
  const payload = await payloadClient()
  const { totalDocs } = await payload.count({
    collection: 'bookings',
    overrideAccess: true,
    where: { and: [{ eventDate: { equals: eventDate } }, { status: { in: ['reserved', 'paid_in_full', 'completed'] } }] },
  })
  return totalDocs
}

export async function retrievePaymentIntent(id: string) {
  return stripe.paymentIntents.retrieve(id)
}
