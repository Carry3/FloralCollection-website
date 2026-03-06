"use client";

import { useEffect, useRef } from "react";

export default function HeroShrinkWrapper({ children }: { children: React.ReactNode }) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const wrapperEl = wrapperRef.current!;
        if (!wrapperEl) return;

        const heroSection = wrapperEl.querySelector<HTMLElement>(".hero") ?? wrapperEl.firstElementChild as HTMLElement;
        if (!heroSection) return;

        function handleHeroScroll() {
            const scrollY = window.scrollY;
            const heroH = heroSection.offsetHeight;
            const progress = Math.min(scrollY / (heroH * 0.6), 1);

            const scale = 1 - progress * 0.12;
            const radius = progress * 16;
            const ty = progress * -20;

            wrapperEl.style.transform = `scale(${scale}) translateY(${ty}px)`;
            wrapperEl.style.borderRadius = `${radius}px`;
        }

        handleHeroScroll();
        window.addEventListener("scroll", handleHeroScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleHeroScroll);
    }, []);

    return (
        <div ref={wrapperRef} className="hero-shrink-wrapper" id="heroWrapper">
            {children}
        </div>
    );
}
