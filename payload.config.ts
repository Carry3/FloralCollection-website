import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { Users } from './collections/Users'
import { Bookings } from './collections/Bookings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Bookings],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // 表结构统一用迁移管理（npm run migrate:create / npm run migrate），开发模式也不自动同步，
    // 避免自动同步在终端里等待确认、卡住请求；开发与线上的表结构保持一致
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      // Cloudflare Workers 不允许跨请求复用数据库连接：每个连接只用一次。
      // 生产环境建议在 Cloudflare 配 Hyperdrive（连接池 + 查询缓存）抵消新建连接的延迟。
      maxUses: 1,
    },
  }),
})
