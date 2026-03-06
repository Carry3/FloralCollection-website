"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePreloader } from "@/components/providers/PreloaderProvider";

const SLIDES = [
    { src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1600&h=900&fit=crop&q=80" },
    { src: "https://images.unsplash.com/photo-1508610048658-a5b83e33f995?w=1600&h=900&fit=crop&q=80" },
    { src: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=1600&h=900&fit=crop&q=80" },
    { src: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1600&h=900&fit=crop&q=80" },
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
                    <div className="hero-overline">The Floral Collection</div>
                    <h1 className="hero-title">
                        Essential · Plus · Luxe · Elite
                    </h1>
                    <p className="hero-subtitle">
                        Curated floral arrangements and packages for every occasion. From everyday elegance to bespoke luxury — we bring quality and beauty to your space.
                    </p>
                    <div className="hero-actions">
                        <Link href="/#packages" className="btn-primary">
                            View Packages
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
