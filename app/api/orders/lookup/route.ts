import { NextResponse } from 'next/server'
import { ORDER_NUMBER_PATTERN, normalizeOrderNumber } from '@/lib/booking'
import { findOrder, publicOrder } from '@/lib/server/orders'
import { signOrder } from '@/lib/server/order-token'
import { clientIp, rateLimit } from '@/lib/server/rate-limit'

/** 订单查询：订单号 + 邮箱都匹配才返回订单（返回一个签名 token，后续付尾款用） */
export async function POST(req: Request) {
  if (!rateLimit(`lookup:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many attempts. Please wait a few minutes and try again.' }, { status: 429 })
  }
  const body = await req.json().catch(() => ({}))
  const orderNumber = normalizeOrderNumber(String(body.orderNumber ?? ''))
  const email = String(body.email ?? '').trim().toLowerCase()

  // 统一的失败提示：不透露是订单号不存在还是邮箱不对
  const notFound = NextResponse.json(
    { error: "We couldn't find an order with that order number and email. Please check both and try again." },
    { status: 404 }
  )
  if (!ORDER_NUMBER_PATTERN.test(orderNumber) || !email) return notFound

  const booking = await findOrder(orderNumber)
  if (!booking || booking.customerEmail.toLowerCase() !== email || booking.status === 'pending_payment') return notFound

  return NextResponse.json({ order: publicOrder(booking), token: signOrder(booking.orderNumber, booking.customerEmail) })
}
