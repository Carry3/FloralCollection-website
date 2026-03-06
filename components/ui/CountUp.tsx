"use client";
import { useEffect, useRef, useState } from "react";

interface Props { target: number; suffix?: string; duration?: number; className?: string; }

export default function CountUp({ target, suffix = "", duration = 2000, className = "" }: Props) {
    const [value, setValue] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const start = performance.now();
                    const tick = (now: number) => {
                        const progress = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setValue(Math.round(eased * target));
                        if (progress < 1) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                }
            },
            { threshold: 0.5 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [target, duration]);

    return <span ref={ref} className={className}>{value.toLocaleString()}{suffix}</span>;
}
