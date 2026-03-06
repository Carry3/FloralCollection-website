"use client";
import { useRef, useEffect } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const GROUPS = [
    {
        title: "Residential",
        items: [
            { label: "Single Family", desc: "Expert management for single-family rental homes, maximizing returns while minimizing your workload.", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=800&fit=crop&q=80" },
            { label: "Condos & Townhomes", desc: "Specialized management for condominiums and townhomes, including HOA coordination and compliance.", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=800&fit=crop&q=80" },
            { label: "Vacation Rentals", desc: "Short-term rental management with dynamic pricing, guest communication, and turnover coordination.", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=800&fit=crop&q=80" },
        ],
    },
    {
        title: "Multifamily",
        items: [
            { label: "Apartments", desc: "Full-service apartment complex management with optimized occupancy and streamlined operations.", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=800&fit=crop&q=80" },
            { label: "Mixed-Use", desc: "Managing the unique challenges of mixed residential and commercial properties.", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=800&fit=crop&q=80" },
            { label: "Student Housing", desc: "Specialized management for student housing with high-turnover expertise.", img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=800&fit=crop&q=80" },
        ],
    },
    {
        title: "Commercial",
        items: [
            { label: "Office", desc: "Professional office space management with tenant retention programs and capital planning.", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=800&fit=crop&q=80" },
            { label: "Retail", desc: "Retail property management with foot traffic optimization and lease administration.", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop&q=80" },
            { label: "Industrial", desc: "Industrial property management with specialized maintenance and compliance oversight.", img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=800&fit=crop&q=80" },
        ],
    },
    {
        title: "Technology",
        items: [
            { label: "24/7 Sensors", desc: "IoT-enabled monitoring for water leaks, temperature, humidity, and security across all properties.", img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=800&fit=crop&q=80" },
            { label: "AI Marketing", desc: "AI-powered listing optimization, dynamic pricing, and targeted advertising for faster leasing.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=800&fit=crop&q=80" },
            { label: "Smart Reports", desc: "Real-time dashboards and automated reporting for complete portfolio visibility.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=800&fit=crop&q=80" },
        ],
    },
];

export default function ServiceColumns() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        let ticking = false;
        const update = () => {
            const viewportH = window.innerHeight;
            const groups = section.querySelectorAll<HTMLElement>(".service-group");

            groups.forEach((group, index) => {
                const nextGroup = groups[index + 1];

                // For the shrinking effect:
                let scale = 1;
                if (nextGroup) {
                    const nextTop = nextGroup.getBoundingClientRect().top;
                    // The next group starts at viewport bottom and scrolls up to 72px.
                    // When it reaches 72px, the current group is fully covered.
                    if (nextTop < viewportH) {
                        const overlapAmount = viewportH - nextTop;
                        const scrollRange = (viewportH - 72) / 2;
                        // shrinkProgress: 0 (when nextTop is at bottom) -> 1 (when nextTop reaches halfway up)
                        const shrinkProgress = Math.max(0, Math.min(1, overlapAmount / scrollRange));
                        // Max shrink we want is 10% (scale = 0.9)
                        scale = 1 - (0.1 * shrinkProgress);
                    }
                }

                group.style.setProperty("--col-scale", `${scale}`);
            });

            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) { requestAnimationFrame(update); ticking = true; }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        update();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <section ref={sectionRef} className="service-groups-container">
            {GROUPS.map((group, gi) => (
                <div key={gi} className="service-group" style={{ height: gi === GROUPS.length - 1 ? "calc(100vh - 72px)" : "calc(160vh - 72px)" }}>
                    <div className="service-columns">
                        {group.items.map((item, ii) => (
                            <ScrollReveal key={ii} delay={ii * 0.1}>
                                <div className="service-col">
                                    <div className="service-col-bg"><img src={item.img} alt={item.label} /></div>
                                    <div className="service-col-overlay" /><div className="service-col-content">
                                        <div className="service-col-title">{item.label}</div>
                                        <p className="service-col-desc">{item.desc}</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}
