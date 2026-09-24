import { NextResponse } from 'next/server'
import { adminEmail, esc, layout, sendEmail } from '@/lib/server/email'
import { clientIp, rateLimit } from '@/lib/server/rate-limit'

const str = (v: unknown, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

/** 联系 / 咨询表单：发到店家邮箱（回复直接回给客户） */
export async function POST(req: Request) {
  if (!rateLimit(`inquiry:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many messages. Please try again later.' }, { status: 429 })
  }
  const body = await req.json().catch(() => ({}))
  if (str(body._gotcha)) return NextResponse.json({ ok: true }) // 蜜罐字段：机器人
  const firstName = str(body.firstName, 80)
  const lastName = str(body.lastName, 80)
  const email = str(body.email, 200)
  const phone = str(body.phone, 40)
  const pkg = str(body.package, 80)
  const message = str(body.message, 4000)
  if (!firstName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter your name and a valid email.' }, { status: 400 })
  }
  const name = `${firstName} ${lastName}`.trim()
  const rows: Array<[string, string]> = [['Name', name], ['Email', email], ['Phone', phone || '—'], ...(pkg ? ([['Package', pkg]] as Array<[string, string]>) : [])]
  const ok = await sendEmail({
    to: adminEmail(),
    replyTo: email,
    subject: `Website inquiry — ${name}${pkg ? ` — ${pkg}` : ''}`,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${message}`,
    html: layout({ heading: 'New website inquiry', intro: esc(message).replace(/\n/g, '<br>') || '(no message)', rows }),
  })
  // 本地未配置邮件服务时 sendEmail 返回 false，但不影响用户提交成功
  if (!ok && process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: `Sorry, your message could not be sent. Please email us directly.` }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}
