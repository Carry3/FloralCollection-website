"use client";

import { TransitionLink } from "@/components/ui/TransitionLink";

const PACKAGES = [
    {
        label: "Essential Package",
        desc: "A curated selection for everyday elegance. Seasonal blooms and refined arrangements for homes and offices.",
        href: "/essential",
        img: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=800&fit=crop&q=80",
    },
    {
        label: "Plus Package",
        desc: "More variety and premium touches. Enhanced presentation and optional add-ons for a step up in style.",
        href: "/plus",
        img: "https://images.unsplash.com/photo-1508610048658-a5b83e33f995?w=600&h=800&fit=crop&q=80",
    },
    {
        label: "Luxe Package",
        desc: "Luxury arrangements and white-glove service. Rare stems, designer vessels, and exceptional presentation.",
        href: "/luxe",
        img: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&h=800&fit=crop&q=80",
    },
    {
        label: "Elite Package",
        desc: "The ultimate bespoke experience. Fully custom designs, dedicated designer, and priority service.",
        href: "/elite",
        img: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=800&fit=crop&q=80",
    },
];

export default function PackageColumns() {
    return (
        <section className="package-columns-section" id="packages">
            <div className="package-columns">
                {PACKAGES.map((item) => (
                    <TransitionLink key={item.href} href={item.href} className="package-col-link">
                        <div className="service-col">
                            <div className="service-col-bg"><img src={item.img} alt={item.label} /></div>
                            <div className="service-col-overlay" />
                            <div className="service-col-content">
                                <div className="service-col-title">{item.label}</div>
                                <p className="service-col-desc">{item.desc}</p>
                                <span className="service-col-cta">
                                    Learn more
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </span>
                            </div>
                        </div>
                    </TransitionLink>
                ))}
            </div>
        </section>
    );
}
