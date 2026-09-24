import type { Metadata } from "next";
import Link from "next/link";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { ORDER_NUMBER_PATTERN, formatCents, formatDateLong } from "@/lib/booking";
import { applyPaymentIntent, balanceCents, findOrder, retrievePaymentIntent } from "@/lib/server/orders";
import { orderLink } from "@/lib/server/order-token";
import PaymentSuccessStatus from "./PaymentSuccessStatus";

export const metadata: Metadata = { title: "Booking Confirmed", robots: { index: false } };
export const dynamic = "force-dynamic";

/**
 * 支付完成后的落地页。付款结果以 Stripe 服务端返回为准（URL 参数只用来定位订单）。
 * 如果 webhook 还没到，这里也会调用同一个幂等的 applyPaymentIntent 先把订单更新好。
 */
export default async function BookingSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ order?: string; payment_intent?: string }>;
}) {
    const { order, payment_intent } = await searchParams;
    let booking = order && ORDER_NUMBER_PATTERN.test(order) ? await findOrder(order) : null;
    let piStatus: string | null = null;

    if (booking && payment_intent) {
        const ownsPi = (booking.payments ?? []).some((p) => p.paymentIntentId === payment_intent);
        if (ownsPi) {
            const pi = await retrievePaymentIntent(payment_intent);
            piStatus = pi.status;
            booking = (await applyPaymentIntent(pi)) ?? booking;
        }
    }

    if (!booking || !piStatus || (piStatus !== "succeeded" && piStatus !== "processing")) {
        return (
            <section className="booking-section booking-success">
                <h1 className="payment-success-title">Payment not completed</h1>
                <p className="booking-success-text">
                    We couldn&apos;t confirm your payment. You have not been charged for an incomplete payment.
                    Please try again, or contact us and we&apos;ll be happy to help.
                </p>
                <TransitionLink href="/contact" className="booking-submit ui-label booking-success-cta">Contact Us</TransitionLink>
            </section>
        );
    }

    const processing = piStatus === "processing";
    const balance = balanceCents(booking);
    return (
        <section className="booking-section booking-success">
            <PaymentSuccessStatus
                label={processing ? "Payment processing" : "Payment successful"}
                title={processing ? "Almost there" : "Your Date Is Reserved"}
            />
            <div className="booking-order-number">
                <span>Your order number</span>
                <strong>{booking.orderNumber}</strong>
            </div>
            <p className="booking-success-text">
                {processing
                    ? "Your payment is being processed by your bank. We'll email you as soon as it's confirmed."
                    : <>A confirmation has been sent to <strong>{booking.customerEmail}</strong>.</>}{" "}
                Keep your order number — with your email address it lets you check your order status any time, no account needed.
            </p>
            <dl className="booking-success-summary">
                <div><dt>Package</dt><dd>{booking.packageName}</dd></div>
                <div><dt>Event</dt><dd>{formatDateLong(booking.eventDate)}, {booking.eventTime}</dd></div>
                {balance > 0 && booking.balanceDueDate && (
                    <div><dt>Balance due</dt><dd>{formatCents(balance)} by {formatDateLong(booking.balanceDueDate)}</dd></div>
                )}
            </dl>
            <div className="booking-success-actions">
                <Link href={orderLink(booking.orderNumber, booking.customerEmail).replace(/^https?:\/\/[^/]+/, "")} className="booking-submit ui-label booking-success-cta">
                    View Your Order
                </Link>
                <TransitionLink href="/" className="btn-text">Back to Home</TransitionLink>
            </div>
        </section>
    );
}
