"use client";
import { useState, useEffect } from "react";

export function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 120;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
}

export function useScrollSpy(sectionIds: string[]) {
    const [activeId, setActiveId] = useState(sectionIds[0]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveId(entry.target.id);
                });
            },
            { rootMargin: "-120px 0px -60% 0px" }
        );
        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [sectionIds]);

    return activeId;
}
