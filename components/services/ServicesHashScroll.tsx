"use client";

import { useEffect } from "react";

/**
 * On /services, scroll to the section matching window.location.hash after mount
 * (e.g. /services#guarantees). No-op if hash is empty or element not found.
 */
export default function ServicesHashScroll() {
    useEffect(() => {
        const hash = window.location.hash?.slice(1);
        if (!hash) return;
        const el = document.getElementById(hash);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []);
    return null;
}
