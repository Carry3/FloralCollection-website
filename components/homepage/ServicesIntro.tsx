import ScrollReveal from "@/components/ui/ScrollReveal";

const INCLUDED = [
    { img: "/images/services/delivery.png", label: "Delivery", w: 390, h: 280 },
    { img: "/images/services/setup.png", label: "Set Up", w: 420, h: 280 },
    { img: "/images/services/removal.png", label: "Removal", w: 400, h: 280 },
];

export default function ServicesIntro() {
    return (
        <section className="services-intro" id="services">
            <div>
                <ScrollReveal>
                    <span className="overline">Our Services</span>
                    <h2>All of Our Packages Include</h2>
                    <p>
                        Your special day should feel effortless, beautiful, and affordable. After you design your wedding
                        with our designer, our team will deliver and set up everything exactly as planned. Once the
                        celebration is over, we&apos;ll handle the removal, leaving you free to simply enjoy your day
                        stress-free.
                    </p>
                </ScrollReveal>
                <div className="included-services">
                    {INCLUDED.map((item, i) => (
                        <ScrollReveal key={item.label} delay={i * 0.12}>
                            <div className="included-service">
                                <img src={item.img} alt="" width={item.w} height={item.h} loading="lazy" />
                                <span className="included-service-label">{item.label}</span>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
