"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePreloader } from "@/components/providers/PreloaderProvider";

const SLIDES = [
    { src: "/images/hero/entrance.webp" },
    { src: "/images/hero/ceremony.webp" },
    { src: "/images/hero/reception.webp" },
    { src: "/images/hero/lounge.webp" },
];

export default function HeroMontage() {
    const [current, setCurrent] = useState(0);
    const { preloaderDone } = usePreloader();

    const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);

    useEffect(() => {
        const id = setInterval(next, 5000);
        return () => clearInterval(id);
    }, [next]);

    return (
        <section className="hero" id="heroSection">
            <div className="hero-montage">
                {SLIDES.map((s, i) => {
                    const shouldLoad = i === 0 || preloaderDone;
                    return (
                        <div key={i} className={`hero-slide ${i === current ? "active" : ""}`}>
                            {shouldLoad && <img src={s.src} alt="" fetchPriority={i === 0 ? "high" : "low"} />}
                        </div>
                    );
                })}
                <div className="hero-overlay" />
                <div className="hero-content">
                    <div className="hero-overline">Premium Floral Rentals &amp; Event Setup</div>
                    <h1 className="hero-title">
                        A Stunning Wedding Without the Stunning Price
                    </h1>
                    <p className="hero-subtitle">
                        Select the wedding package that best fits your vision. From there, we take care of everything — delivery, setup, and removal — so you can simply enjoy your special day.
                    </p>
                    <div className="hero-actions">
                        <Link href="/#packages" className="btn-primary">
                            Our Packages
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </Link>
                        <Link href="/contact" className="btn-secondary">
                            Contact Us
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </Link>
                    </div>
                </div>
                <div className="hero-indicators">
                    {SLIDES.map((_, i) => (
                        <button key={i} className={`hero-indicator ${i === current ? "active" : ""}`} onClick={() => setCurrent(i)} />
                    ))}
                </div>
                <div className="hero-scroll-indicator">
                    <span>Scroll</span>
                    <div className="scroll-line" />
                </div>
            </div>
        </section>
    );
}
