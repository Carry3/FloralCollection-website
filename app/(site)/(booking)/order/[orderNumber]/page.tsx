import type { Metadata } from "next";
import OrderLookup from "@/components/orders/OrderLookup";
import OrderStatus from "@/components/orders/OrderStatus";
import { ORDER_NUMBER_PATTERN, normalizeOrderNumber } from "@/lib/booking";
import { applyPaymentIntent, findOrder, publicOrder, retrievePaymentIntent } from "@/lib/server/orders";
import { verifyOrderToken } from "@/lib/server/order-token";

export const metadata: Metadata = { title: "Order Status", robots: { index: false } };
export const dynamic = "force-dynamic";

/** 邮件里的直达链接：/order/TFC-XXXX-XXXX?t=<签名>。签名不对就退回到"订单号 + 邮箱"查询表单 */
export default async function OrderDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ orderNumber: string }>;
    searchParams: Promise<{ t?: string; payment_intent?: string }>;
}) {
    const orderNumber = normalizeOrderNumber(decodeURIComponent((await params).orderNumber));
    const { t, payment_intent } = await searchParams;

    let booking = ORDER_NUMBER_PATTERN.test(orderNumber) ? await findOrder(orderNumber) : null;
    const valid = !!booking && booking.status !== "pending_payment" && verifyOrderToken(booking.orderNumber, booking.customerEmail, t);

    if (!booking || !valid) {
        return (
            <section className="booking-section order-section" data-no-intro>
                <OrderLookup initialOrderNumber={ORDER_NUMBER_PATTERN.test(orderNumber) ? orderNumber : ""} notice={t ? "This link is no longer valid. Please enter your email to view the order." : undefined} />
            </section>
        );
    }

    // 刚付完尾款跳回来：先按 Stripe 结果同步订单（webhook 可能稍晚到）
    if (payment_intent && (booking.payments ?? []).some((p) => p.paymentIntentId === payment_intent)) {
        booking = (await applyPaymentIntent(await retrievePaymentIntent(payment_intent))) ?? booking;
    }

    return (
        <section className="booking-section order-section" data-no-intro>
            <OrderStatus order={publicOrder(booking)} token={t!} />
        </section>
    );
}
