import ScrollReveal from "@/components/ui/ScrollReveal";
import CountUp from "@/components/ui/CountUp";

const FACTS = [
    { number: 500, suffix: "+", label: "Properties Managed" },
    { number: 98, suffix: "%", label: "Client Retention" },
    { number: 24, suffix: "/7", label: "Monitoring" },
    { number: 15, suffix: "+", label: "Years Experience" },
];

export default function ServicesIntro() {
    return (
        <section className="services-intro" id="services">
            <div>
                <ScrollReveal>
                    <span className="overline">Our Services</span>
                    <h2>Services We Offer That Set Us Apart From Everyone</h2>
                    <p>
                        We invest into our client&apos;s investment. Taking care of your home, like it is our own — with
                        cutting-edge technology and meticulous attention to detail.
                    </p>
                </ScrollReveal>
                <div className="quick-facts">
                    {FACTS.map((f, i) => (
                        <ScrollReveal key={i} delay={i * 0.1}>
                            <div className="quick-fact">
                                <CountUp target={f.number} suffix={f.suffix} className="quick-fact-number" />
                                <span className="quick-fact-label">{f.label}</span>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
