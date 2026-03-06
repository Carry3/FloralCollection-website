"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
    image: string;
    title: string;
    subtitle?: string;
    overline?: string;
    compact?: boolean;
}

export default function SubpageHero({ image, title, subtitle, overline, compact }: Props) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const bgRef = useRef<HTMLDivElement>(null);   // background container only (clip here)
    const wrapperRef = useRef<HTMLDivElement>(null);   // image + overlay (3D fold)
    const titleWrapRef = useRef<HTMLDivElement>(null);   // h1 + subtitle (colour change)
    const overlayRef = useRef<HTMLDivElement>(null);

    // Robust theme detection:
    // - initialised synchronously so the first GSAP run already has the right value
    // - MutationObserver keeps it in sync if the theme switches at runtime
    const [isDark, setIsDark] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return document.documentElement.dataset.theme === "dark";
    });

    useEffect(() => {
        const read = () => setIsDark(document.documentElement.dataset.theme === "dark");
        read(); // in case attribute was set between SSR and effect
        const mo = new MutationObserver(read);
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        return () => mo.disconnect();
    }, []);

    useGSAP(() => {
        if (!sectionRef.current || !wrapperRef.current || !bgRef.current || !titleWrapRef.current) return;

        const DUR = 1; // 0.0 = 0 %  |  0.6 = 60 %  |  1.0 = 100 %

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            }
        });

        // ── 0 → 100 %: 3D fold + fade image out at the end ──
        tl.to(wrapperRef.current, {
            duration: DUR,
            clipPath: "polygon(49.38% 50.62%, 50.62% 0%, 50.62% 100%, 49.38% 50.62%)",
            rotateY: 60,
            rotateX: -100,
            skewY: 15,
            scaleX: 0.5,
            scaleY: 2.2,
        }, 0);

        // ── 0 → 100 %: overlay fades ──
        if (overlayRef.current) {
            tl.to(overlayRef.current, { duration: DUR, opacity: 0, ease: "none" }, 0);
        }

        // ── 0 → 60 %: text colour (light mode only; dark mode stays white via CSS) ──
        if (!isDark) {
            const textEls = titleWrapRef.current.querySelectorAll("h1, p");
            tl.fromTo(textEls,
                { color: "#ffffff" },
                { color: "#1a1a1a", ease: "none", duration: DUR * 0.7 },
                0
            );
        }

    }, { scope: sectionRef, dependencies: [isDark] });

    return (
        <section ref={sectionRef} className={`subpage-hero ${compact ? "compact" : ""}`}>
            <div className="subpage-hero-sticky">

                {/* Background layer — gets clipped in the second animation phase */}
                <div ref={bgRef} className="subpage-hero-bg">
                    <div ref={wrapperRef} className="subpage-hero-image-wrapper">
                        <Image src={image} alt="" fill priority sizes="100vw" />
                        <div ref={overlayRef} className="subpage-hero-overlay" />
                    </div>
                </div>

                {/* Content layer — entirely separate from the clip, never disappears */}
                <div className="subpage-hero-content">
                    {overline && <div className="overline">{overline}</div>}
                    <div ref={titleWrapRef} className="subpage-hero-title-wrap">
                        <h1 className="subpage-hero-title">{title}</h1>
                        {subtitle && <p className="subpage-hero-subtitle">{subtitle}</p>}
                    </div>
                </div>

            </div>
        </section>
    );
}
