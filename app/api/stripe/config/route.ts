import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * 前端 Stripe publishable key（公开值）。
 * NEXT_PUBLIC_ 变量只在构建时写进前端代码；Cloudflare 构建环境没配时前端就拿不到，
 * 所以前端改为运行时从这里读取。用 env 对象间接访问，避免被构建时替换成空字符串。
 */
export function GET() {
  const env = process.env
  const publishableKey = env.STRIPE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
  if (!publishableKey) return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 })
  return NextResponse.json({ publishableKey }, { headers: { 'Cache-Control': 'public, max-age=300' } })
}
