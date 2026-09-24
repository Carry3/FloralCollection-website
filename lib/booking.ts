/**
 * 在线预订规则 —— 依据网站 FAQ：
 *  - 锁定日期需要 50% 不退还定金 + 签署协议（两者都完成才算锁定）
 *  - 剩余 50% 须在婚礼前、按协议约定的截止日付清
 *  - 信用卡付款加收 2.5% 手续费
 * 前后端共用（不含任何密钥）。
 */
import type { FlowerPackage } from "@/lib/packages";

export const DEPOSIT_RATE = 0.5;
export const CARD_FEE_RATE = 0.025;

/** 尾款截止日 = 婚礼日期前 N 天。TODO: 与客户协议文本中的截止日保持一致 */
export const BALANCE_DUE_DAYS = 14;
/** 最早可预订：今天起 N 天后（给设计沟通与备货留时间）。TODO: 与客户确认 */
export const MIN_LEAD_DAYS = 7;
/** 同一天最多接几场活动；满了就不能在线预订该日期（仍可咨询）。TODO: 与客户确认 */
export const MAX_EVENTS_PER_DAY = 2;

/** 协议版本号：修改协议正文时递增，订单里会记录用户同意的是哪一版 */
export const AGREEMENT_VERSION = "2026-09";

/** 活动开始时间可选项 */
export const EVENT_TIMES = [
    "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
    "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM",
];

export type PaymentPlan = "deposit" | "full";
export type PaymentKind = "deposit" | "full" | "balance";

export type OrderStatus =
    | "pending_payment" // 已下单，定金 / 全款尚未付成功
    | "reserved" // 定金已付 + 协议已签 → 日期已锁定，待付尾款
    | "paid_in_full" // 已付清
    | "completed" // 活动已完成
    | "cancelled";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
    pending_payment: "Awaiting Payment",
    reserved: "Date Reserved — Balance Due",
    paid_in_full: "Paid in Full",
    completed: "Completed",
    cancelled: "Cancelled",
};

const DAY = 24 * 60 * 60 * 1000;

/** 店家所在时区（南佛罗里达）。"今天"、尾款是否逾期、付款日期显示都以此为准，
    服务端（Cloudflare 上是 UTC）与浏览器显示一致，避免跨午夜时日期差一天 */
export const BUSINESS_TIMEZONE = "America/New_York";

/** YYYY-MM-DD → 当天 UTC 零点 */
export function parseDateOnly(value: string): Date {
    return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
}

export function toDateOnly(d: Date): string {
    return d.toISOString().slice(0, 10);
}

export function todayDateOnly(): string {
    // en-CA 的日期格式就是 YYYY-MM-DD
    return new Date().toLocaleDateString("en-CA", { timeZone: BUSINESS_TIMEZONE });
}

/** 时间戳 → 店家时区的日期，如 9/23/2026 */
export function formatTimestampDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", { timeZone: BUSINESS_TIMEZONE });
}

export function addDays(dateOnly: string, days: number): string {
    return toDateOnly(new Date(parseDateOnly(dateOnly).getTime() + days * DAY));
}

export function minEventDate(): string {
    return addDays(todayDateOnly(), MIN_LEAD_DAYS);
}

export function balanceDueDate(eventDate: string): string {
    return addDays(eventDate, -BALANCE_DUE_DAYS);
}

/** 离尾款截止日已经不足时（婚礼太近），只能一次付清 */
export function depositAllowed(eventDate: string): boolean {
    return balanceDueDate(eventDate) > todayDateOnly();
}

export function cardFee(amountCents: number): number {
    return Math.round(amountCents * CARD_FEE_RATE);
}

export interface Quote {
    totalCents: number;
    /** 本次支付的套餐金额（不含手续费） */
    amountCents: number;
    feeCents: number;
    /** 本次实际刷卡金额 = amount + fee */
    chargeCents: number;
    /** 之后还需支付的套餐金额（不含手续费） */
    remainingCents: number;
}

export function quote(pkg: Pick<FlowerPackage, "price">, plan: PaymentPlan): Quote {
    const totalCents = Math.round(pkg.price * 100);
    const amountCents = plan === "deposit" ? Math.round(totalCents * DEPOSIT_RATE) : totalCents;
    const feeCents = cardFee(amountCents);
    return { totalCents, amountCents, feeCents, chargeCents: amountCents + feeCents, remainingCents: totalCents - amountCents };
}

export function formatCents(cents: number): string {
    return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: cents % 100 ? 2 : 0 });
}

export function formatDateLong(dateOnly: string): string {
    return parseDateOnly(dateOnly).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

/** 订单号格式：TFC-XXXX-XXXX（Crockford Base32：不含 I/L/O/U；用户误输入的 O、I、L 会自动当作 0、1） */
export const ORDER_NUMBER_PATTERN = /^TFC-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/;

/** 用户手输的订单号规范化：去空格、转大写、补连字符、把易混字符换成正确的 */
export function normalizeOrderNumber(input: string): string {
    const raw = input.toUpperCase().replace(/[^0-9A-Z]/g, "").replace(/O/g, "0").replace(/[IL]/g, "1");
    const body = raw.startsWith("TFC") ? raw.slice(3) : raw;
    if (body.length !== 8) return input.trim().toUpperCase();
    return `TFC-${body.slice(0, 4)}-${body.slice(4)}`;
}
