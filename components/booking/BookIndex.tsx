"use client";

import { TransitionLink } from "@/components/ui/TransitionLink";
import { PACKAGES, formatPrice } from "@/lib/packages";

export default function BookIndex() {
    return (
        <div className="booking-package-grid">
            {PACKAGES.map((p) => (
                <TransitionLink key={p.id} href={`/book/${p.id}`} className="booking-package-card">
                    <div className="booking-package-img"><img src={p.img} alt={p.name} /></div>
                    <h2>{p.name}</h2>
                    <p className="booking-package-desc">{p.desc}</p>
                    <div className="booking-package-price">
                        <strong>{formatPrice(p.price)}</strong>
                        <span>· {formatPrice(p.price / 2)} deposit to reserve</span>
                    </div>
                    <span className="booking-package-cta ui-label">Book now →</span>
                </TransitionLink>
            ))}
        </div>
    );
}
