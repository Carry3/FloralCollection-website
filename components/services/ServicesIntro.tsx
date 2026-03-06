"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

const QUICK_FACTS = [
    { value: "24/7", label: "Sensor Monitoring" },
    { value: "12", label: "Core Services" },
    { value: "0%", label: "Maintenance Markup" },
    { value: "4", label: "Owner Guarantees" },
] as const;

export default function ServicesIntro() {
    return (
        <section className="services-intro" aria-labelledby="services-intro-heading">
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
                <ScrollReveal delay={0}>
                    <h2 id="services-intro-heading">
                        Services We Offer That Set Us Apart
                    </h2>
                </ScrollReveal>
                <ScrollReveal delay={0.15}>
                    <p>
                        We invest in our client&apos;s investment. Taking care of your home, like it is our own. We manage residential, multifamily, and commercial properties with the same standard of proactive care, smart technology, and complete transparency.
                    </p>
                </ScrollReveal>
                <ScrollReveal delay={0.3}>
                    <div className="quick-facts" role="list">
                        {QUICK_FACTS.map(({ value, label }, i) => (
                            <div key={i} className="quick-fact" role="listitem">
                                <span className="quick-fact-number">{value}</span>
                                <span className="quick-fact-label">{label}</span>
                            </div>
                        ))}
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
