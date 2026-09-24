"use client";

import { useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { getStripePromise } from "@/lib/stripe-client";
import { STRIPE_APPEARANCE } from "@/components/booking/BookingFlow";
import { CARD_FEE_RATE, formatCents, formatDateLong, formatTimestampDate } from "@/lib/booking";
import type { PublicOrder } from "@/lib/server/orders";

const STEPS: Array<{ key: string; label: string }> = [
    { key: "reserved", label: "Date reserved" },
    { key: "paid_in_full", label: "Paid in full" },
    { key: "completed", label: "Event complete" },
];

function stepIndex(status: PublicOrder["status"]) {
    return status === "completed" ? 2 : status === "paid_in_full" ? 1 : 0;
}

function BalanceForm({ orderNumber, token, chargeLabel }: { orderNumber: string; token: string; chargeLabel: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setSubmitting(true);
        setError(null);
        const returnUrl = `${window.location.origin}/order/${orderNumber}?t=${encodeURIComponent(token)}`;
        const { error: err, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
            confirmParams: { return_url: returnUrl },
        });
        if (err) {
            setError(err.message || "Payment failed. Please try again.");
            setSubmitting(false);
            return;
        }
        window.location.href = `${returnUrl}&payment_intent=${paymentIntent?.id ?? ""}`;
    };

    return (
        <form onSubmit={submit} className="booking-payment-form">
            <PaymentElement />
            <button type="submit" className="booking-submit ui-label" disabled={!stripe || submitting}>
                {submitting ? "Processing…" : `Pay ${chargeLabel}`}
            </button>
            {error && <div className="booking-error" role="alert">{error}</div>}
        </form>
    );
}

export default function OrderStatus({ order, token }: { order: PublicOrder; token: string }) {
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const current = stepIndex(order.status);
    const cancelled = order.status === "cancelled";

    const startBalance = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/orders/${order.orderNumber}/pay-balance`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Could not start payment");
            setClientSecret(data.clientSecret);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="order-status">
            <header className="order-status-head">
                <span className="tracking-label">Order</span>
                <h1>{order.orderNumber}</h1>
                <span className={`order-badge order-badge--${order.status}`}>{order.statusLabel}</span>
            </header>

            {!cancelled && (
                <ol className="order-steps" aria-label="Order progress">
                    {STEPS.map((s, i) => (
                        <li key={s.key} className={i <= current ? "is-done" : ""} aria-current={i === current ? "step" : undefined}>
                            <span className="order-step-dot" aria-hidden="true" />
                            {s.label}
                        </li>
                    ))}
                </ol>
            )}

            <div className="order-grid">
                <section className="order-card">
                    <h2>Your Event</h2>
                    <dl>
                        <div><dt>Name</dt><dd>{order.customerName}</dd></div>
                        <div><dt>Package</dt><dd>{order.packageName}</dd></div>
                        <div><dt>Date</dt><dd>{formatDateLong(order.eventDate)}</dd></div>
                        <div><dt>Start time</dt><dd>{order.eventTime}</dd></div>
                        <div><dt>Venue</dt><dd>{[order.venueName, order.venueAddress].filter(Boolean).join(" — ")}</dd></div>
                        {order.agreementSignedAt && <div><dt>Agreement signed</dt><dd>{formatTimestampDate(order.agreementSignedAt)}</dd></div>}
                    </dl>
                </section>

                <section className="order-card">
                    <h2>Payments</h2>
                    <dl>
                        <div><dt>Package total</dt><dd>{formatCents(order.totalCents)}</dd></div>
                        {order.payments.map((p, i) => (
                            <div key={i}>
                                <dt>
                                    {p.kind === "deposit" ? "Deposit (50%)" : p.kind === "full" ? "Paid in full" : "Balance"}
                                    {p.paidAt ? ` · ${formatTimestampDate(p.paidAt)}` : ""}
                                </dt>
                                <dd>{formatCents(p.amountCents)}{p.feeCents ? ` + ${formatCents(p.feeCents)} fee` : ""}</dd>
                            </div>
                        ))}
                        <div className="order-card-total"><dt>Balance remaining</dt><dd>{formatCents(order.balanceCents)}</dd></div>
                    </dl>

                    {order.canPayBalance && (
                        <div className={`order-balance${order.balanceOverdue ? " is-overdue" : ""}`}>
                            <p>
                                {order.balanceOverdue ? "Your balance was due" : "Balance due by"}{" "}
                                <strong>{order.balanceDueDate ? formatDateLong(order.balanceDueDate) : "—"}</strong>.
                                Card payments include a {CARD_FEE_RATE * 100}% processing fee ({formatCents(order.balanceFeeCents)}).
                            </p>
                            {!clientSecret ? (
                                <button type="button" className="booking-submit ui-label" onClick={startBalance} disabled={loading}>
                                    {loading ? "Preparing…" : `Pay Balance — ${formatCents(order.balanceCents + order.balanceFeeCents)}`}
                                </button>
                            ) : (
                                <Elements stripe={getStripePromise()} options={{ clientSecret, appearance: STRIPE_APPEARANCE }}>
                                    <BalanceForm orderNumber={order.orderNumber} token={token} chargeLabel={formatCents(order.balanceCents + order.balanceFeeCents)} />
                                </Elements>
                            )}
                            {error && <div className="booking-error" role="alert">{error}</div>}
                        </div>
                    )}
                </section>
            </div>

            <p className="order-help">
                Need to reschedule, upgrade or ask a question? <TransitionLink href="/contact">Contact us</TransitionLink> and mention your order number.
            </p>
        </div>
    );
}
