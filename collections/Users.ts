import { CollectionConfig } from 'payload'

/**
 * 后台（/admin）登录账号 —— 只给店家员工用；顾客不需要注册，凭订单号 + 邮箱查询订单。
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      // admin 可查看 / 管理订单；如需只读员工账号可另设 user
      name: 'role',
      type: 'select',
      defaultValue: 'admin',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Staff (no order access)', value: 'user' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
