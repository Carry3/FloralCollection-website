"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { SERVICE_SCREENS } from "@/lib/services-content";

const PANEL_COUNT = SERVICE_SCREENS.length;

export default function ServicesResidentialScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [reducedMotion, setReducedMotion] = useState(false);
    const currentIndexRef = useRef(0);
    const lastWheelRef = useRef(0);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mq.matches);
        const handler = () => setReducedMotion(mq.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        if (reducedMotion) return;
        const container = containerRef.current;
        if (!container) return;

        const panels = container.querySelectorAll<HTMLElement>(".services-residential-panel");
        if (panels.length === 0) return;

        const getPanelTops = () => {
            const rect = container.getBoundingClientRect();
            const containerTop = rect.top + window.scrollY;
            return Array.from(panels).map((el, i) => ({
                index: i,
                top: containerTop + el.offsetTop,
            }));
        };

        const scrollToIndex = (index: number) => {
            const tops = getPanelTops();
            const t = tops[Math.max(0, Math.min(index, tops.length - 1))];
            if (t) {
                window.scrollTo({ top: t.top, behavior: "smooth" });
                currentIndexRef.current = t.index;
            }
        };

        const onWheel = (e: WheelEvent) => {
            const rect = container.getBoundingClientRect();
            const inView = rect.top <= 100 && rect.bottom >= window.innerHeight * 0.5;
            if (!inView) return;

            const now = Date.now();
            if (now - lastWheelRef.current < 600) {
                e.preventDefault();
                return;
            }
            lastWheelRef.current = now;

            const tops = getPanelTops();
            const scrollY = window.scrollY + window.innerHeight * 0.4;
            let current = 0;
            for (let i = tops.length - 1; i >= 0; i--) {
                if (scrollY >= tops[i].top) {
                    current = i;
                    break;
                }
            }
            currentIndexRef.current = current;

            if (e.deltaY > 20 && current < PANEL_COUNT - 1) {
                e.preventDefault();
                scrollToIndex(current + 1);
            } else if (e.deltaY < -20 && current > 0) {
                e.preventDefault();
                scrollToIndex(current - 1);
            }
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        return () => window.removeEventListener("wheel", onWheel);
    }, [reducedMotion]);

    return (
        <div
            ref={containerRef}
            className="services-residential-scroll"
            data-reduced-motion={reducedMotion ? "true" : "false"}
        >
            {SERVICE_SCREENS.map((item, index) => (
                <section
                    key={item.id}
                    className="services-residential-panel"
                    aria-labelledby={`service-title-${item.id}`}
                >
                    <div className="services-residential-panel-inner">
                        <div className="services-residential-panel-text">
                            <h3 id={`service-title-${item.id}`} className="services-residential-panel-title">
                                {item.title}
                            </h3>
                            <p className="services-residential-panel-desc">{item.description}</p>
                        </div>
                        {item.image && (
                            <div className="services-residential-panel-img">
                                <Image
                                    src={item.image}
                                    alt=""
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    loading={index < 2 ? "eager" : "lazy"}
                                />
                            </div>
                        )}
                    </div>
                </section>
            ))}
        </div>
    );
}
