"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/packages";
import Lightbox from "./Lightbox";

/**
 * 套餐页 Gallery：沿用设计稿的两行网格，照片超出一屏时可左右滚动（箭头 / 触控板 / 手指滑动），
 * 点击任一张打开大图，大图里也能左右切换。
 */
export default function PhotoCarousel({ photos, label }: { photos: Photo[]; label: string }) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [edges, setEdges] = useState({ start: true, end: true });
    const [active, setActive] = useState<number | null>(null);

    const updateEdges = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setEdges({
            start: el.scrollLeft <= 2,
            end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
        });
    }, []);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        updateEdges();
        const ro = new ResizeObserver(updateEdges);
        ro.observe(el);
        el.addEventListener("scroll", updateEdges, { passive: true });
        return () => {
            ro.disconnect();
            el.removeEventListener("scroll", updateEdges);
        };
    }, [updateEdges]);

    const page = (dir: 1 | -1) => {
        const el = trackRef.current;
        if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
    };

    const scrollable = !(edges.start && edges.end);

    return (
        <div className={`photo-carousel${scrollable ? " is-scrollable" : ""}`}>
            <div ref={trackRef} className="photo-carousel-track" role="list" aria-label={label}>
                {photos.map((photo, i) => (
                    <button
                        key={photo.src}
                        type="button"
                        role="listitem"
                        className="photo-carousel-item"
                        onClick={() => setActive(i)}
                        aria-label={`View photo: ${photo.alt}`}
                    >
                        <img src={photo.src} alt="" width={photo.width} height={photo.height} loading="lazy" />
                    </button>
                ))}
            </div>
            {scrollable && (
                <>
                    <button
                        type="button"
                        className="photo-carousel-nav photo-carousel-nav--prev"
                        aria-label="Scroll photos left"
                        disabled={edges.start}
                        onClick={() => page(-1)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <button
                        type="button"
                        className="photo-carousel-nav photo-carousel-nav--next"
                        aria-label="Scroll photos right"
                        disabled={edges.end}
                        onClick={() => page(1)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                </>
            )}
            <Lightbox photos={photos} index={active} onIndexChange={setActive} onClose={() => setActive(null)} />
        </div>
    );
}
