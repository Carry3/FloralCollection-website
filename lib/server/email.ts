/**
 * 发邮件：Resend REST API（与 REMG 网站同一方案，可在 Cloudflare Workers 上运行）。
 * 未配置 RESEND_API_KEY 时不发送，只在服务端日志里打印（本地开发用）。
 *
 * 环境变量：
 *   RESEND_API_KEY   https://resend.com/api-keys
 *   EMAIL_FROM       发件人，需先在 Resend 验证域名，如 "The Floral Collection <orders@thefloralcollections.com>"
 *   ADMIN_EMAIL      店家收件箱（新订单 / 咨询通知），默认 Contact@thefloralcollections.com
 */
import { CONTACT } from '@/lib/site'

export interface EmailMessage {
  to: string | string[]
  subject: string
  html: string
  text: string
  replyTo?: string
}

export function adminEmail(): string {
  return process.env.ADMIN_EMAIL || CONTACT.email
}

export async function sendEmail(msg: EmailMessage): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || 'The Floral Collection <onboarding@resend.dev>'
  if (!apiKey) {
    console.info(`[email] RESEND_API_KEY 未配置，跳过发送 → ${[msg.to].flat().join(', ')} | ${msg.subject}\n${msg.text}`)
    return false
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [msg.to].flat(),
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
      }),
    })
    if (!res.ok) {
      console.error(`[email] 发送失败 HTTP ${res.status}: ${await res.text()}`)
      return false
    }
    return true
  } catch (err) {
    console.error('[email] 发送异常', err)
    return false
  }
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

/** 统一的邮件外框：品牌调色板、单栏、手机可读 */
export function layout(opts: { heading: string; intro: string; rows?: Array<[string, string]>; cta?: { label: string; href: string }; footer?: string }): string {
  const rows = (opts.rows ?? [])
    .map(([k, v]) => `<tr><td style="padding:8px 0;color:#6f6559;font-size:14px;">${esc(k)}</td><td style="padding:8px 0;color:#4a4238;font-size:14px;text-align:right;font-weight:600;">${esc(v)}</td></tr>`)
    .join('')
  return `<!doctype html><html><body style="margin:0;background:#F2ECE9;font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2ECE9;padding:32px 12px;"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #D1C6B8;border-radius:12px;">
<tr><td style="padding:32px 32px 8px;text-align:center;">
<div style="font-family:Georgia,serif;letter-spacing:.18em;font-size:13px;color:#7a705e;text-transform:uppercase;">The Floral Collection</div>
<h1 style="font-family:Georgia,serif;font-weight:400;color:#4a4238;font-size:26px;margin:16px 0 8px;">${esc(opts.heading)}</h1>
<p style="color:#6f6559;font-size:15px;line-height:1.6;margin:0;">${opts.intro}</p>
</td></tr>
${rows ? `<tr><td style="padding:16px 32px;"><table role="presentation" width="100%" style="border-top:1px solid #EBE7E5;border-bottom:1px solid #EBE7E5;">${rows}</table></td></tr>` : ''}
${opts.cta ? `<tr><td style="padding:8px 32px 24px;text-align:center;"><a href="${opts.cta.href}" style="display:inline-block;background:#948A77;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:14px;letter-spacing:.08em;text-transform:uppercase;">${esc(opts.cta.label)}</a></td></tr>` : ''}
<tr><td style="padding:0 32px 32px;color:#948A77;font-size:12px;line-height:1.6;text-align:center;">${opts.footer ?? ''}<br>${esc(CONTACT.email)} · ${esc(CONTACT.phone)} · ${esc(CONTACT.area)}</td></tr>
</table></td></tr></table></body></html>`
}

export { esc }
