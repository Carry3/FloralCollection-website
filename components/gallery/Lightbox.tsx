"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Photo } from "@/lib/packages";
import { useScrollLock } from "@/hooks/useScrollLock";

interface Props {
    photos: Photo[];
    /** 当前显示第几张；null = 关闭 */
    index: number | null;
    onIndexChange: (index: number) => void;
    onClose: () => void;
}

/** 大图查看：左右箭头 / 键盘 ← → / 手机左右滑动切换，Esc 或点背景关闭 */
export default function Lightbox({ photos, index, onIndexChange, onClose }: Props) {
    const open = index !== null;
    const touchX = useRef<number | null>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    useScrollLock(open);

    const go = (delta: number) => {
        if (index === null) return;
        onIndexChange((index + delta + photos.length) % photos.length);
    };

    useEffect(() => {
        if (!open) return;
        closeRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            // 捕获阶段拦下，避免同时关掉外层的相册弹窗
            if (e.key === "Escape") onClose();
            else if (e.key === "ArrowRight") go(1);
            else if (e.key === "ArrowLeft") go(-1);
            else return;
            e.stopPropagation();
            e.preventDefault();
        };
        window.addEventListener("keydown", onKey, true);
        return () => window.removeEventListener("keydown", onKey, true);
    });

    if (!open || typeof document === "undefined") return null;
    const photo = photos[index];

    return createPortal(
        <div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`Photo ${index + 1} of ${photos.length}`}
            onClick={onClose}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
                if (touchX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                touchX.current = null;
                if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            }}
        >
            <button ref={closeRef} type="button" className="lightbox-close" aria-label="Close" onClick={onClose}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>

            <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
                <img key={photo.src} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} />
                <figcaption>
                    <span>{photo.alt}</span>
                    <span className="lightbox-count">{index + 1} / {photos.length}</span>
                </figcaption>
            </figure>

            {photos.length > 1 && (
                <>
                    <button
                        type="button"
                        className="lightbox-nav lightbox-nav--prev"
                        aria-label="Previous photo"
                        onClick={(e) => { e.stopPropagation(); go(-1); }}
                    >
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <button
                        type="button"
                        className="lightbox-nav lightbox-nav--next"
                        aria-label="Next photo"
                        onClick={(e) => { e.stopPropagation(); go(1); }}
                    >
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                </>
            )}
        </div>,
        document.body
    );
}
