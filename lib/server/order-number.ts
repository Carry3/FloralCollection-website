import { randomBytes } from 'node:crypto'

/** Crockford Base32：不含 I/L/O/U，读写不易混淆 */
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

/** 生成 TFC-XXXX-XXXX 订单号：8 位随机字符（约 40 bit），不按顺序，无法据此推测别人的订单号 */
export function generateOrderNumber(): string {
  const bytes = randomBytes(8)
  let body = ''
  for (const b of bytes) body += ALPHABET[b & 31]
  return `TFC-${body.slice(0, 4)}-${body.slice(4)}`
}
