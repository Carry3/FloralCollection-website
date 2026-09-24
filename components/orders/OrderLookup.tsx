"use client";

import { useState } from "react";
import { normalizeOrderNumber } from "@/lib/booking";
import type { PublicOrder } from "@/lib/server/orders";
import OrderStatus from "./OrderStatus";

/** 游客查单：订单号 + 下单邮箱 */
export default function OrderLookup({ initialOrderNumber = "", notice }: { initialOrderNumber?: string; notice?: string }) {
    const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
    const [email, setEmail] = useState("");
    const [result, setResult] = useState<{ order: PublicOrder; token: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/orders/lookup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderNumber: normalizeOrderNumber(orderNumber), email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Order not found");
            setResult(data);
            // 地址栏换成带签名的直达链接，刷新 / 收藏都能直接打开
            history.replaceState(null, "", `/order/${data.order.orderNumber}?t=${encodeURIComponent(data.token)}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (result) return <OrderStatus order={result.order} token={result.token} />;

    return (
        <form className="order-lookup" onSubmit={submit}>
            <span className="tracking-label">Order Status</span>
            <h1>Check Your Order</h1>
            <p className="order-lookup-sub">
                Enter the order number from your confirmation email and the email address you booked with. No account needed.
            </p>
            {notice && <p className="order-lookup-notice">{notice}</p>}
            <label className="booking-field">
                <span className="ui-label">Order number</span>
                <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    onBlur={() => setOrderNumber((v) => (v ? normalizeOrderNumber(v) : v))}
                    placeholder="TFC-XXXX-XXXX"
                    autoCapitalize="characters"
                    spellCheck={false}
                    required
                />
            </label>
            <label className="booking-field">
                <span className="ui-label">Email</span>
                <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </label>
            <button type="submit" className="booking-submit ui-label" disabled={loading || !orderNumber || !email}>
                {loading ? "Looking up…" : "Find My Order"}
            </button>
            {error && <div className="booking-error" role="alert">{error}</div>}
        </form>
    );
}
