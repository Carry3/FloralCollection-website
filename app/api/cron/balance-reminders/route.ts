import { NextResponse } from 'next/server'
import { addDays, todayDateOnly } from '@/lib/booking'
import { payloadClient, sendBalanceReminder, type BookingDoc } from '@/lib/server/orders'

/** 尾款提前几天开始提醒 */
const REMIND_BEFORE_DAYS = 7

/**
 * 尾款提醒（替代原来的"前一天自动扣卡"——FAQ 规定尾款按协议截止日前付清）。
 * 每天调用一次：
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://<域名>/api/cron/balance-reminders
 * 发送时机：截止日前 7 天、截止日当天、逾期后每 3 天一次（直到付清 / 订单被取消）。
 */
export async function GET(req: Request) {
  if (!process.env.CRON_SECRET || req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const today = todayDateOnly()
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'bookings',
    overrideAccess: true,
    limit: 500,
    where: { and: [{ status: { equals: 'reserved' } }, { balanceDueDate: { less_than_equal: addDays(today, REMIND_BEFORE_DAYS) } }] },
  })

  const results: Array<{ orderNumber: string; sent: string }> = []
  for (const doc of docs as unknown as BookingDoc[]) {
    const due = doc.balanceDueDate
    if (!due) continue
    const last = doc.emails?.lastReminderAt?.slice(0, 10)
    if (last === today) continue
    const overdue = due < today
    const daysSinceLast = last ? Math.round((Date.parse(today) - Date.parse(last)) / 86_400_000) : Infinity
    const shouldSend = due === addDays(today, REMIND_BEFORE_DAYS) || due === today || (overdue && daysSinceLast >= 3)
    if (!shouldSend) continue
    await sendBalanceReminder(doc, overdue)
    results.push({ orderNumber: doc.orderNumber, sent: overdue ? 'overdue' : due === today ? 'due_today' : 'upcoming' })
  }
  return NextResponse.json({ checked: docs.length, sent: results })
}
