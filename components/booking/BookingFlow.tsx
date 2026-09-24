"use client";

import { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Link from "next/link";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { PACKAGES, type FlowerPackage } from "@/lib/packages";
import {
    BALANCE_DUE_DAYS,
    CARD_FEE_RATE,
    EVENT_TIMES,
    balanceDueDate,
    depositAllowed,
    formatCents,
    formatDateLong,
    minEventDate,
    quote,
    type PaymentPlan,
} from "@/lib/booking";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

/** Stripe Elements 外观：跟随网站调色板 */
export const STRIPE_APPEARANCE = {
    theme: "stripe" as const,
    variables: {
        colorPrimary: "#948A77",
        colorText: "#4a4238",
        colorTextSecondary: "#6f6559",
        colorBackground: "#ffffff",
        colorDanger: "#b4553f",
        borderRadius: "8px",
        fontFamily: "Inter, -apple-system, sans-serif",
    },
};

function CheckoutForm({ orderNumber, chargeLabel }: { orderNumber: string; chargeLabel: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setSubmitting(true);
        setError(null);
        const returnUrl = `${window.location.origin}/book/success?order=${encodeURIComponent(orderNumber)}`;
        const { error: submitError, paymentIntent } = await stripe.confirmPayment({
            elements,
            // 需要跳转验证（3D Secure 等）的支付方式会自动跳到 return_url；否则留在本页，由我们自己跳转
            redirect: "if_required",
            confirmParams: { return_url: returnUrl },
        });
        if (submitError) {
            setError(submitError.message || "Payment failed. Please try again.");
            setSubmitting(false);
            return;
        }
        window.location.href = `${returnUrl}&payment_intent=${paymentIntent?.id ?? ""}`;
    };

    return (
        <form onSubmit={handleSubmit} className="booking-payment-form">
            <PaymentElement />
            <button type="submit" disabled={!stripe || submitting} className="booking-submit ui-label">
                {submitting ? "Processing…" : `Pay ${chargeLabel}`}
            </button>
            {error && <div className="booking-error" role="alert">{error}</div>}
        </form>
    );
}

export default function BookingFlow({ pkg }: { pkg: FlowerPackage }) {
    const [form, setForm] = useState({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        eventDate: "",
        eventTime: "",
        venueName: "",
        venueAddress: "",
        notes: "",
        signatureName: "",
    });
    const [plan, setPlan] = useState<PaymentPlan>("deposit");
    const [agreed, setAgreed] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [orderNumber, setOrderNumber] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const minDate = useMemo(() => minEventDate(), []);
    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [k]: e.target.value }));

    // 婚礼太近（已过尾款截止日）时只能付全款
    const canDeposit = !form.eventDate || depositAllowed(form.eventDate);
    const effectivePlan: PaymentPlan = canDeposit ? plan : "full";
    const q = quote(pkg, effectivePlan);

    const formValid =
        form.customerName.trim().length >= 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail) &&
        form.customerPhone.replace(/\D/g, "").length >= 7 &&
        form.eventDate >= minDate &&
        EVENT_TIMES.includes(form.eventTime) &&
        form.venueAddress.trim().length >= 5 &&
        agreed &&
        form.signatureName.trim().length >= 2;

    const proceedToPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/bookings/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, packageId: pkg.id, paymentPlan: effectivePlan, agreementAccepted: agreed }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to start payment");
            setClientSecret(data.clientSecret);
            setOrderNumber(data.orderNumber);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="booking-layout">
            <aside className="booking-summary">
                <div className="booking-summary-img">
                    <img src={pkg.img} alt={pkg.name} />
                </div>
                <p className="tracking-label booking-summary-label">Package {pkg.number}</p>
                <h2 className="booking-summary-name">{pkg.name}</h2>
                <p className="booking-summary-desc">Delivery, setup &amp; removal included.</p>
                <div className="booking-summary-price">
                    <div><span>Package total</span><strong>{formatCents(q.totalCents)}</strong></div>
                    <div>
                        <span>{effectivePlan === "deposit" ? "Deposit today (50%, nonrefundable)" : "Paid in full today"}</span>
                        <strong>{formatCents(q.amountCents)}</strong>
                    </div>
                    <div><span>Card processing fee ({CARD_FEE_RATE * 100}%)</span><strong>{formatCents(q.feeCents)}</strong></div>
                    <div className="booking-summary-total"><span>Charged today</span><strong>{formatCents(q.chargeCents)}</strong></div>
                    {effectivePlan === "deposit" && (
                        <div>
                            <span>
                                Balance due{form.eventDate ? ` by ${formatDateLong(balanceDueDate(form.eventDate))}` : ` ${BALANCE_DUE_DAYS} days before your event`}
                            </span>
                            <strong>{formatCents(q.remainingCents)}</strong>
                        </div>
                    )}
                </div>
                <div className="booking-switch">
                    {PACKAGES.filter((p) => p.id !== pkg.id).map((p) => (
                        <TransitionLink key={p.id} href={`/book/${p.id}`} className="booking-switch-link">
                            Switch to {p.name} →
                        </TransitionLink>
                    ))}
                </div>
            </aside>

            <div className="booking-form-panel">
                {!clientSecret ? (
                    <form onSubmit={proceedToPayment} noValidate>
                        <h3 className="booking-step-title">Your Details</h3>
                        <div className="booking-grid-2">
                            <label className="booking-field">
                                <span className="ui-label">Full name</span>
                                <input type="text" autoComplete="name" value={form.customerName} onChange={set("customerName")} required />
                            </label>
                            <label className="booking-field">
                                <span className="ui-label">Phone</span>
                                <input type="tel" autoComplete="tel" value={form.customerPhone} onChange={set("customerPhone")} placeholder="(555) 000-0000" required />
                            </label>
                        </div>
                        <label className="booking-field">
                            <span className="ui-label">Email</span>
                            <input type="email" autoComplete="email" value={form.customerEmail} onChange={set("customerEmail")} placeholder="you@example.com" required />
                            <small>Your order number and receipts will be sent here.</small>
                        </label>

                        <h3 className="booking-step-title">Your Event</h3>
                        <div className="booking-grid-2">
                            <label className="booking-field">
                                <span className="ui-label">Event date</span>
                                <input type="date" min={minDate} value={form.eventDate} onChange={set("eventDate")} required />
                            </label>
                            <label className="booking-field">
                                <span className="ui-label">Start time</span>
                                <select value={form.eventTime} onChange={set("eventTime")} required>
                                    <option value="" disabled>Select a time</option>
                                    {EVENT_TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </label>
                        </div>
                        <label className="booking-field">
                            <span className="ui-label">Venue name (optional)</span>
                            <input type="text" value={form.venueName} onChange={set("venueName")} />
                        </label>
                        <label className="booking-field">
                            <span className="ui-label">Venue address</span>
                            <input type="text" autoComplete="street-address" value={form.venueAddress} onChange={set("venueAddress")} placeholder="Street, city, state" required />
                        </label>
                        <label className="booking-field">
                            <span className="ui-label">Your wedding vision (optional)</span>
                            <textarea rows={3} value={form.notes} onChange={set("notes")} placeholder="Colors, style, inspiration — our designer will follow up to plan the details." />
                        </label>

                        <h3 className="booking-step-title">Payment Option</h3>
                        <div className="booking-plan" role="radiogroup" aria-label="Payment option">
                            <label className={`booking-plan-option${effectivePlan === "deposit" ? " is-selected" : ""}${canDeposit ? "" : " is-disabled"}`}>
                                <input type="radio" name="plan" checked={effectivePlan === "deposit"} disabled={!canDeposit} onChange={() => setPlan("deposit")} />
                                <span>
                                    <strong>50% deposit — {formatCents(quote(pkg, "deposit").amountCents)}</strong>
                                    <small>
                                        {canDeposit
                                            ? `Balance due ${BALANCE_DUE_DAYS} days before your event.`
                                            : `Not available — your event is less than ${BALANCE_DUE_DAYS} days away.`}
                                    </small>
                                </span>
                            </label>
                            <label className={`booking-plan-option${effectivePlan === "full" ? " is-selected" : ""}`}>
                                <input type="radio" name="plan" checked={effectivePlan === "full"} onChange={() => setPlan("full")} />
                                <span>
                                    <strong>Pay in full — {formatCents(q.totalCents)}</strong>
                                    <small>Nothing more to pay later.</small>
                                </span>
                            </label>
                        </div>

                        <h3 className="booking-step-title">Rental Agreement</h3>
                        <label className="booking-agree">
                            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                            <span>
                                I have read and agree to the{" "}
                                <Link href="/legal/rental-agreement" target="_blank" rel="noopener">Rental Agreement</Link>, including the
                                nonrefundable 50% deposit, the balance deadline and the {CARD_FEE_RATE * 100}% card processing fee.
                            </span>
                        </label>
                        <label className="booking-field">
                            <span className="ui-label">Type your full name to sign</span>
                            <input type="text" className="booking-signature" value={form.signatureName} onChange={set("signatureName")} placeholder="Full legal name" required />
                        </label>

                        <button type="submit" className="booking-submit ui-label" disabled={!formValid || loading}>
                            {loading ? "Preparing payment…" : "Continue to Payment"}
                        </button>
                        <p className="booking-fine-print">
                            Your date is reserved once your deposit is received and the agreement is signed. Prefer to talk first?{" "}
                            <TransitionLink href={`/contact?package=${encodeURIComponent(pkg.name)}`}>Send us an inquiry</TransitionLink>.
                        </p>
                        {error && <div className="booking-error" role="alert">{error}</div>}
                    </form>
                ) : (
                    <>
                        <h3 className="booking-step-title">Payment</h3>
                        <div className="booking-recap">
                            {formatDateLong(form.eventDate)} · {form.eventTime} · {form.venueName || form.venueAddress}
                        </div>
                        <Elements stripe={stripePromise} options={{ clientSecret, appearance: STRIPE_APPEARANCE }}>
                            <CheckoutForm orderNumber={orderNumber} chargeLabel={formatCents(q.chargeCents)} />
                        </Elements>
                        <p className="booking-fine-print">
                            Includes a {CARD_FEE_RATE * 100}% card processing fee of {formatCents(q.feeCents)}. Payments are processed securely by Stripe.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
