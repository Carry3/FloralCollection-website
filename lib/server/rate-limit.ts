/**
 * 极简的按 IP 限流（进程内存）。防止有人批量试订单号 / 刷接口。
 * 注意：Cloudflare Workers 多实例之间不共享内存，上线后建议再在 Cloudflare 配一条 Rate Limiting 规则兜底。
 */
const buckets = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const b = buckets.get(key)
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    if (buckets.size > 5000) for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k)
    return true
  }
  b.count++
  return b.count <= limit
}

export function clientIp(req: Request): string {
  return req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local'
}
