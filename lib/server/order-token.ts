import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * 订单直达链接的签名：邮件里的"查看订单"链接带上 ?t=<签名>，打开即可查看，不用再输入邮箱。
 * 签名 = HMAC(订单号 + 邮箱)，没有密钥无法伪造；换了邮箱或订单号签名即失效。
 */
function secret(): string {
  const s = process.env.ORDER_LINK_SECRET || process.env.PAYLOAD_SECRET
  if (!s) throw new Error('ORDER_LINK_SECRET is not configured')
  return s
}

export function signOrder(orderNumber: string, email: string): string {
  return createHmac('sha256', secret())
    .update(`${orderNumber}|${email.trim().toLowerCase()}`)
    .digest('base64url')
    .slice(0, 32)
}

export function verifyOrderToken(orderNumber: string, email: string, token: string | null | undefined): boolean {
  if (!token) return false
  const expected = Buffer.from(signOrder(orderNumber, email))
  const given = Buffer.from(token)
  return expected.length === given.length && timingSafeEqual(expected, given)
}

export function siteUrl(): string {
  // SITE_URL 在运行时读取（Cloudflare 后台配置即可生效）；NEXT_PUBLIC_ 变量会在构建时被写死，仅作后备
  return (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
}

export function orderLink(orderNumber: string, email: string): string {
  return `${siteUrl()}/order/${orderNumber}?t=${signOrder(orderNumber, email)}`
}
