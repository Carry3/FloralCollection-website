import { CollectionConfig } from 'payload'

/**
 * 在线预订订单。
 * 客户无需注册：凭「订单号 + 邮箱」或邮件里的签名链接查询（见 /order）。
 * 只有后台管理员能通过 Payload API / 后台读写；前台查询走自己的 API，只返回脱敏后的字段。
 */
export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'packageName', 'eventDate', 'status', 'balanceDueDate'],
    description: 'Online bookings. Update the status here (e.g. Completed / Cancelled) — customers see the latest status on their order page.',
  },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin',
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'orderNumber', type: 'text', required: true, unique: true, index: true, admin: { readOnly: true } },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending_payment',
      index: true,
      options: [
        { label: 'Awaiting Payment', value: 'pending_payment' },
        { label: 'Date Reserved — Balance Due', value: 'reserved' },
        { label: 'Paid in Full', value: 'paid_in_full' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },

    /* ── 客户 ── */
    {
      type: 'row',
      fields: [
        { name: 'customerName', type: 'text', required: true },
        { name: 'customerEmail', type: 'email', required: true, index: true },
        { name: 'customerPhone', type: 'text' },
      ],
    },

    /* ── 套餐 / 活动 ── */
    {
      type: 'row',
      fields: [
        { name: 'packageId', type: 'text', required: true },
        { name: 'packageName', type: 'text', required: true },
        { name: 'packagePrice', type: 'number', required: true, admin: { description: 'USD' } },
      ],
    },
    {
      type: 'row',
      fields: [
        // 仅日期（YYYY-MM-DD）以文本存储，避免时区换算把日期挪一天
        { name: 'eventDate', type: 'text', required: true, index: true, admin: { description: 'YYYY-MM-DD' } },
        { name: 'eventTime', type: 'text', required: true },
        { name: 'balanceDueDate', type: 'text', index: true, admin: { description: 'Balance due date (YYYY-MM-DD)' } },
      ],
    },
    { name: 'venueName', type: 'text' },
    { name: 'venueAddress', type: 'text', required: true },
    { name: 'notes', type: 'textarea', admin: { description: 'Wedding vision / notes from the customer' } },

    /* ── 付款 ── */
    {
      name: 'paymentPlan',
      type: 'select',
      required: true,
      options: [
        { label: '50% Deposit', value: 'deposit' },
        { label: 'Paid in Full', value: 'full' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'totalCents', type: 'number', required: true, admin: { description: 'Package total in cents (excl. card fee)' } },
        { name: 'paidCents', type: 'number', defaultValue: 0, admin: { description: 'Amount paid in cents (excl. card fee)' } },
      ],
    },
    {
      name: 'payments',
      type: 'array',
      admin: { description: 'Each Stripe payment (deposit / full / balance). Amounts in cents.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'kind', type: 'select', required: true, options: ['deposit', 'full', 'balance'] },
            { name: 'status', type: 'select', required: true, defaultValue: 'pending', options: ['pending', 'succeeded', 'failed'] },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'amountCents', type: 'number', required: true },
            { name: 'feeCents', type: 'number', required: true },
            { name: 'paidAt', type: 'date' },
          ],
        },
        { name: 'paymentIntentId', type: 'text', required: true, index: true },
      ],
    },
    { name: 'stripeCustomerId', type: 'text', admin: { position: 'sidebar' } },

    /* ── 协议（点击同意 + 输入全名作为签名） ── */
    {
      name: 'agreement',
      type: 'group',
      fields: [
        { name: 'signatureName', type: 'text', required: true },
        { name: 'version', type: 'text', required: true },
        { name: 'acceptedAt', type: 'date', required: true },
        { name: 'ipAddress', type: 'text' },
      ],
    },

    /* ── 邮件发送记录（防重复发送） ── */
    {
      name: 'emails',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'confirmationSentAt', type: 'date' },
        { name: 'balanceReceiptSentAt', type: 'date' },
        { name: 'lastReminderAt', type: 'date' },
        { name: 'reminderCount', type: 'number', defaultValue: 0 },
      ],
    },
  ],
}
