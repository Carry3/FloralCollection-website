import { TransitionLink } from "@/components/ui/TransitionLink";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ActiveOnScroll from "@/components/ui/ActiveOnScroll";
import { PACKAGES, formatPrice } from "@/lib/packages";

export default function WeddingPackages() {
    return (
        <section className="wedding-packages" id="packages" aria-labelledby="wedding-packages-heading">
            <ScrollReveal>
                <div className="wedding-packages-header">
                    <h2 id="wedding-packages-heading">Wedding Packages</h2>
                    <span className="floral-divider" aria-hidden="true" />
                    <p>Choose the collection that best fits your vision.</p>
                </div>
            </ScrollReveal>
            <ActiveOnScroll className="wedding-packages-grid" selector=".wedding-package-card">
                {PACKAGES.map((pkg, i) => (
                    <ScrollReveal key={pkg.id} delay={(i % 2) * 0.1}>
                        <TransitionLink href={pkg.href} className="wedding-package-card">
                            <img src={pkg.img} alt={pkg.name} width={1448} height={1086} loading="lazy" />
                            <div className="wedding-package-card-shade" aria-hidden="true" />
                            <div className="wedding-package-card-body">
                                <span className="wedding-package-card-name">{pkg.name}</span>
                                <span className="floral-divider floral-divider--light" aria-hidden="true" />
                                <span className="wedding-package-card-price">{formatPrice(pkg.price)}</span>
                                <span className="wedding-package-card-cta">
                                    <span className="cta-pointer">Click to see details</span>
                                    <span className="cta-touch">Tap to see details</span>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </span>
                            </div>
                        </TransitionLink>
                    </ScrollReveal>
                ))}
            </ActiveOnScroll>
        </section>
    );
}
