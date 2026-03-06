"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";

const CARDS = [
    {
        img: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&h=506&fit=crop&q=80",
        alt: "Fresh flowers",
        title: "Freshness Guarantee",
    },
    {
        img: "https://images.unsplash.com/photo-1508610048658-a5b83e33f995?w=900&h=506&fit=crop&q=80",
        alt: "Quality blooms",
        title: "Quality Promise",
    },
    {
        img: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=900&h=506&fit=crop&q=80",
        alt: "Sustainable sourcing",
        title: "Sustainable Sourcing",
    },
    {
        img: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=900&h=506&fit=crop&q=80",
        alt: "Careful delivery",
        title: "Careful Delivery",
    },
];

const RADIUS = 500;
const ANGLE_STEP = 50;
const Y_STEP = 135;
const HEADER_H = 72;

function normalizeAngle(deg: number) {
    deg = deg % 360;
    if (deg > 180) deg -= 360;
    if (deg < -180) deg += 360;
    return deg;
}

export default function Guarantees() {
    const sectionRef = useRef<HTMLElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const cylinderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const overlay = overlayRef.current;
        const header = headerRef.current;
        const track = trackRef.current;
        const cylinder = cylinderRef.current;
        if (!section || !overlay || !header || !track || !cylinder) return;

        const total = CARDS.length;
        const slots = Array.from(
            cylinder.querySelectorAll<HTMLElement>(".guarantees-card-slot")
        );
        const imgs = slots.map(s => s.querySelector("img") as HTMLImageElement);

        const h2 = header.querySelector<HTMLElement>("h2")!;
        const overline = section.querySelector<HTMLElement>(".overline")!;

        const applyScroll = () => {
            const viewportH = window.innerHeight;

            /* 背景遮罩进度：header 底部进入视口 → header 中心到达视口中央 */
            const hRect = header.getBoundingClientRect();
            const bgStart = viewportH - hRect.height;
            const bgEnd = viewportH / 2 - hRect.height / 2;
            const bgProgress = Math.max(0, Math.min(1, (bgStart - hRect.top) / (bgStart - bgEnd)));
            overlay.style.opacity = String(bgProgress);

            /* 标题文字：#1a1a1a → #ffffff，overline accent → #ffffff */
            const c = Math.round(26 + bgProgress * 229); // 26 (#1a) → 255 (#ff)
            h2.style.color = `rgb(${c},${c},${c})`;
            overline.style.color = `rgba(255,255,255,${bgProgress})`;

            /* 轮播进度 */
            const rect = track.getBoundingClientRect();
            const scrollDistance = track.offsetHeight - (viewportH - HEADER_H);
            const scrolled = HEADER_H - rect.top;
            const progress = Math.max(0, Math.min(1, scrolled / scrollDistance));

            if (window.innerWidth <= 1000) return;

            const sv = progress * (total - 1);
            const cylRotY = -(sv * ANGLE_STEP);
            const cylTransY = -(sv * Y_STEP);
            cylinder.style.transform =
                `translateZ(-200px) translateY(${cylTransY}px) rotateY(${cylRotY}deg)`;

            slots.forEach((slot, i) => {
                const cardAngle = i * ANGLE_STEP;
                const yOffset = i * Y_STEP;
                const worldAngle = normalizeAngle(cardAngle + cylRotY);
                const absAngle = Math.abs(worldAngle);

                const scale = Math.max(0.4, 1 - (absAngle / 130) * 0.6);
                const brightness = Math.max(0.2, 1 - (absAngle / 120) * 0.8);

                slot.style.transform =
                    `translateY(${yOffset}px) rotateY(${cardAngle}deg) translateZ(${RADIUS}px) scale(${scale})`;
                if (imgs[i]) imgs[i].style.filter = `brightness(${brightness})`;
            });
        };

        window.addEventListener("scroll", applyScroll, { passive: true });
        applyScroll();

        return () => {
            window.removeEventListener("scroll", applyScroll);
        };
    }, []);

    return (
        <section ref={sectionRef} className="guarantees">
            {/* 黑色背景遮罩，随滚动淡入 */}
            <div ref={overlayRef} className="guarantees-bg-overlay" />

            <div className="guarantees-top-text">
                <span className="overline">Our Promise</span>
            </div>

            {/* Desktop: sticky scroll-jacked cylinder carousel */}
            <div ref={trackRef} className="guarantees-track">
                <div className="guarantees-pin">
                    <div ref={headerRef} className="guarantees-header">
                        <h2>What We Stand For</h2>
                    </div>
                    <div className="guarantees-viewport">
                        <div ref={cylinderRef} className="guarantees-cylinder">
                            {CARDS.map((card, i) => (
                                <div key={i} className="guarantees-card-slot">
                                    <div className="guarantees-card-inner">
                                        <Image fill src={card.img} alt={card.alt} style={{ objectFit: "cover" }} />
                                        <div className="guarantees-card-label">{card.title}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile: 2×2 / 1×4 grid */}
            <div className="guarantees-mobile-grid">
                {CARDS.map((card, i) => (
                    <div key={i} className="guarantees-mobile-card">
                        <Image fill src={card.img} alt={card.alt} style={{ objectFit: "cover" }} />
                        <div className="guarantees-card-label">{card.title}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
