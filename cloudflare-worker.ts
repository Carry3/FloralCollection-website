/**
 * Cloudflare Worker 入口：在 OpenNext 生成的 Worker 外包一层，加上定时任务（Cron Triggers）。
 * 定时事件 → 以内部请求调用 /api/cron/balance-reminders（带 CRON_SECRET），发送尾款提醒邮件。
 * 执行时间见 wrangler.jsonc 的 triggers.crons。
 */
// @ts-ignore —— 该文件由 `opennextjs-cloudflare build` 生成
import handler from './.open-next/worker.js'

interface Env {
  CRON_SECRET?: string
  [key: string]: unknown
}

export default {
  fetch: handler.fetch,

  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    const req = new Request('https://internal.cron/api/cron/balance-reminders', {
      headers: { authorization: `Bearer ${env.CRON_SECRET ?? ''}` },
    })
    ctx.waitUntil(
      handler.fetch(req, env, ctx).then(async (res: Response) => {
        console.log(`[cron] balance-reminders → ${res.status} ${await res.text()}`)
      })
    )
  },
} satisfies ExportedHandler<Env>
