"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GUARANTEES = [
    {
        id: "g1",
        title: "No Tenant, No Management Fee",
        description: "If your property is not producing rental income, we do not charge a management fee. During any vacancy, we continue actively marketing, conducting showings, and working to secure qualified placement.",
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
        ),
    },
    {
        id: "g2",
        title: "Pet Damage Protection",
        description: "We provide up to $500 in additional protection for pet-related damage beyond the tenant's security deposit. This reduces out-of-pocket repair costs while allowing access to a larger tenant pool.",
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        ),
    },
    {
        id: "g3",
        title: "Smart Sensor Installation — On Us",
        description: "We install smart monitoring sensors throughout the property at our cost. Sensors monitor HVAC, water heaters, and moisture areas. Included for owners with a one-year management agreement.",
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
        ),
    },
    {
        id: "g4",
        title: "No First Month Rent Fee",
        description: "We never charge first-month rent fees, leasing commissions, renewal fees, or any hidden lease-up charges. Compensation tied to long-term performance.",
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
        ),
    },
] as const;

export default function ServicesGuaranteesSpiral() {
    const sectionRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mq.matches);
        const h = () => setReducedMotion(mq.matches);
        mq.addEventListener("change", h);
        return () => mq.removeEventListener("change", h);
    }, []);

    useEffect(() => {
        if (reducedMotion || !sectionRef.current || !gridRef.current) return;
        const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
        if (cards.length !== 4) return;

        const section = sectionRef.current;
        const grid = gridRef.current;

        const initAndAnimate = () => {
            const sectionRect = section.getBoundingClientRect();
            const gridRect = grid.getBoundingClientRect();
            const centerX = gridRect.left - sectionRect.left + gridRect.width / 2;
            const centerY = gridRect.top - sectionRect.top + gridRect.height / 2;

            const fromVals = cards.map((el, i) => {
                const r = el.getBoundingClientRect();
                const cardCenterX = r.left - sectionRect.left + r.width / 2;
                const cardCenterY = r.top - sectionRect.top + r.height / 2;
                return {
                    x: centerX - cardCenterX,
                    y: centerY - cardCenterY,
                    rotation: (i - 2) * 20,
                };
            });

            cards.forEach((el, i) => {
                gsap.set(el, {
                    x: fromVals[i].x,
                    y: fromVals[i].y,
                    scale: 0.25,
                    opacity: 0,
                    rotation: fromVals[i].rotation,
                });
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 70%",
                    end: "top 25%",
                    scrub: true,
                },
            });

            cards.forEach((el, i) => {
                tl.to(
                    el,
                    {
                        x: 0,
                        y: 0,
                        scale: 1,
                        opacity: 1,
                        rotation: 0,
                        duration: 0.35,
                        ease: "power2.out",
                    },
                    i * 0.12
                );
            });
        };

        const raf = requestAnimationFrame(() => initAndAnimate());
        return () => {
            cancelAnimationFrame(raf);
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, [reducedMotion]);

    return (
        <section
            id="guarantees"
            ref={sectionRef}
            className="services-guarantees"
            aria-labelledby="guarantees-heading"
        >
            <h2 id="guarantees-heading" className="services-guarantees-heading">
                Our Guarantees
            </h2>
            <div
                ref={gridRef}
                className={`services-guarantees-grid ${reducedMotion ? "reduced-motion" : ""}`}
                role="list"
            >
                {GUARANTEES.map((item, i) => (
                    <div
                        key={item.id}
                        ref={(el) => { cardRefs.current[i] = el; }}
                        className="services-guarantee-card"
                        role="listitem"
                    >
                        <div className="services-guarantee-card-icon" aria-hidden>
                            {item.icon}
                        </div>
                        <h3 className="services-guarantee-card-title">{item.title}</h3>
                        <p className="services-guarantee-card-desc">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
