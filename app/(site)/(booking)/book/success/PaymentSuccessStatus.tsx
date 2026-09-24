"use client";

import { useEffect, useState } from "react";

export default function PaymentSuccessStatus({ label, title }: { label: string; title: string }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // 触发动画
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className={`payment-success-status${visible ? " is-visible" : ""}`}>
            <div className="payment-success-icon">
                <svg viewBox="0 0 52 52" width="64" height="64">
                    <circle className="payment-success-circle" cx="26" cy="26" r="24" fill="none" />
                    <path className="payment-success-check" fill="none" d="M14 27l7 7 16-16" />
                </svg>
            </div>
            <p className="tracking-label payment-success-label">{label}</p>
            <h1 className="payment-success-title">{title}</h1>
        </div>
    );
}
