"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import ActiveOnScroll from "@/components/ui/ActiveOnScroll";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { useScrollLock } from "@/hooks/useScrollLock";
import { PACKAGES, getPackagePhotos } from "@/lib/packages";
import Lightbox from "./Lightbox";

/* 与导航菜单同一套节奏：先横向变宽、再纵向变高，圆角随之变化，最后内容淡入 */
const GROW = 0.45; // 每一段（宽 / 高）的时长
const EASE_OPEN = "expo.out"; // ≈ 菜单的 cubic-bezier(0.16, 1, 0.3, 1)
const EASE_CLOSE = "power2.inOut";
const RADIUS = 22;

/**
 * Gallery 页：四个套餐卡片。点击后，卡片的边框像导航菜单那样先变宽、再变高，展开成大弹窗；
 * 弹窗顶部是当前套餐，左右箭头切换套餐；关闭时边框按相反顺序收回到当前套餐的卡片。
 */
export default function GalleryExplorer() {
    const [openId, setOpenId] = useState<string | null>(null);
    const [activeId, setActiveId] = useState(PACKAGES[0].id);
    const [photoIndex, setPhotoIndex] = useState<number | null>(null);
    const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const panelRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);
    const animating = useRef(false);

    useScrollLock(openId !== null);

    const pkg = PACKAGES.find((p) => p.id === activeId) ?? PACKAGES[0];
    const photos = getPackagePhotos(pkg);

    const open = (id: string) => {
        if (animating.current) return;
        setActiveId(id);
        setOpenId(id);
        history.replaceState(null, "", `#${id}`);
    };

    /* 展开：边框从卡片的位置 / 尺寸出发，先横向铺开到最终宽度，再纵向铺开到最终高度 */
    useLayoutEffect(() => {
        if (!openId) return;
        const panel = panelRef.current;
        const inner = innerRef.current;
        const backdrop = backdropRef.current;
        if (!panel || !inner || !backdrop) return;
        animating.current = true;

        const to = panel.getBoundingClientRect();
        const radius = parseFloat(getComputedStyle(panel).borderTopLeftRadius) || 0;
        const from = cardRefs.current[openId]?.getBoundingClientRect() ?? to;
        // 横向铺开时保持以卡片为中心，超出屏幕就贴边
        const midLeft = Math.min(Math.max(from.left + from.width / 2 - to.width / 2, to.left), to.left);

        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(panel, { clearProps: "top,left,width,height,borderRadius,opacity" });
                animating.current = false;
                closeBtnRef.current?.focus();
            },
        });
        tl.set(panel, { top: from.top, left: from.left, width: from.width, height: from.height, borderRadius: 4, opacity: 0 })
            .set(inner, { opacity: 0 })
            .to(backdrop, { opacity: 1, duration: 0.5, ease: "power1.out" }, 0)
            .to(panel, { opacity: 1, duration: 0.15, ease: "none" }, 0)
            .to(panel, { width: to.width, left: midLeft, duration: GROW, ease: EASE_OPEN }, 0)
            .to(panel, { borderRadius: radius, duration: 0.2, ease: "power1.out" }, GROW * 0.5)
            .to(panel, { height: to.height, top: to.top, left: to.left, duration: GROW, ease: EASE_OPEN }, GROW)
            .to(inner, { opacity: 1, duration: 0.35, ease: "power1.out" }, GROW * 2 - 0.05)
            .fromTo(
                inner.querySelectorAll(".gallery-modal-photo"),
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.03 },
                GROW * 2
            );

        return () => {
            tl.kill();
        };
        // 只在打开的那一刻跑动画；弹窗内切换套餐不重跑
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openId]);

    /* 收起：顺序与展开相反 —— 内容淡出，先收高度，再收宽度，回到"当前"套餐的卡片 */
    const close = useCallback(() => {
        const panel = panelRef.current;
        if (!panel || animating.current || !openId) return;
        animating.current = true;
        const from = panel.getBoundingClientRect();
        // 收回到当前套餐的卡片；它不在屏幕内（弹窗里切换过套餐）就收回到最初点开的那张，避免边框飞出屏幕
        const inView = (r?: DOMRect) => !!r && r.top >= 0 && r.bottom <= window.innerHeight;
        const activeRect = cardRefs.current[activeId]?.getBoundingClientRect();
        const to = inView(activeRect) ? activeRect : cardRefs.current[openId]?.getBoundingClientRect() ?? activeRect;

        const finish = () => {
            animating.current = false;
            setOpenId(null);
            history.replaceState(null, "", window.location.pathname);
        };
        const tl = gsap.timeline({ onComplete: finish });
        tl.to(innerRef.current, { opacity: 0, duration: 0.2, ease: "power1.in" }, 0)
            .to(backdropRef.current, { opacity: 0, duration: GROW * 2, ease: "power1.inOut" }, 0.1);
        if (to) {
            const midLeft = Math.min(Math.max(to.left + to.width / 2 - from.width / 2, from.left), from.left);
            tl.set(panel, { top: from.top, left: from.left, width: from.width, height: from.height }, 0)
                .to(panel, { height: to.height, top: to.top, left: midLeft, duration: GROW, ease: EASE_CLOSE }, 0.15)
                .to(panel, { borderRadius: 4, duration: 0.2, ease: "power1.in" }, 0.15 + GROW * 0.7)
                .to(panel, { width: to.width, left: to.left, duration: GROW, ease: EASE_CLOSE }, 0.15 + GROW)
                .to(panel, { opacity: 0, duration: 0.15, ease: "none" }, 0.15 + GROW * 2 - 0.1);
        } else {
            tl.to(panel, { opacity: 0, duration: 0.3 }, 0);
        }
    }, [activeId, openId]);

    /* Esc 关闭（灯箱开着时由灯箱自己先处理） */
    useEffect(() => {
        if (!openId) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
            else if (e.key === "ArrowRight") step(1);
            else if (e.key === "ArrowLeft") step(-1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    /* 带锚点进入（例如 /gallery#luxe）时打开对应套餐 —— 等开屏幕布 / logo 落位结束再展开，
       否则展开动画会被幕布挡住 */
    useEffect(() => {
        const id = window.location.hash.slice(1);
        if (!PACKAGES.some((p) => p.id === id)) return;
        const run = () => open(id);
        const fallback = setTimeout(run, 4500);
        const onReady = () => {
            clearTimeout(fallback);
            setTimeout(run, 300);
        };
        window.addEventListener("pageTransitionComplete", onReady, { once: true });
        return () => {
            clearTimeout(fallback);
            window.removeEventListener("pageTransitionComplete", onReady);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** 切换到上一个 / 下一个套餐（循环），内容朝箭头方向滑出、滑入 */
    const step = (dir: 1 | -1) => {
        const inner = innerRef.current;
        if (!inner || animating.current) return;
        const i = PACKAGES.findIndex((p) => p.id === activeId);
        const next = PACKAGES[(i + dir + PACKAGES.length) % PACKAGES.length];
        const targets = inner.querySelectorAll(".gallery-modal-swap");
        animating.current = true;
        history.replaceState(null, "", `#${next.id}`);
        gsap.to(targets, {
            opacity: 0,
            x: -24 * dir,
            duration: 0.18,
            ease: "power1.in",
            onComplete: () => {
                setActiveId(next.id);
                inner.querySelector(".gallery-modal-body")?.scrollTo({ top: 0 });
                requestAnimationFrame(() =>
                    gsap.fromTo(
                        inner.querySelectorAll(".gallery-modal-swap"),
                        { opacity: 0, x: 24 * dir },
                        { opacity: 1, x: 0, duration: 0.35, ease: "power2.out", onComplete: () => void (animating.current = false) }
                    )
                );
            },
        });
    };

    return (
        <>
            <ActiveOnScroll className="gallery-cards" selector=".gallery-card">
                {PACKAGES.map((p) => (
                    <button
                        key={p.id}
                        type="button"
                        ref={(el) => {
                            cardRefs.current[p.id] = el;
                        }}
                        className="gallery-card"
                        onClick={() => open(p.id)}
                        aria-haspopup="dialog"
                    >
                        <img src={p.galleryCard} alt={p.name} width={560} height={330} loading="lazy" />
                        <span className="gallery-card-body">
                            <span className="gallery-card-title">Package {p.number}</span>
                            <span className="gallery-card-btn">View photos of this package</span>
                            <span className="floral-divider" aria-hidden="true" />
                        </span>
                    </button>
                ))}
            </ActiveOnScroll>

            {openId &&
                createPortal(
                    <div className="gallery-modal-root">
                        <div ref={backdropRef} className="gallery-modal-backdrop" onClick={close} aria-hidden="true" />
                        <div ref={panelRef} className="gallery-modal" role="dialog" aria-modal="true" aria-label={`${pkg.name} photos`}>
                            <div ref={innerRef} className="gallery-modal-inner">
                                <header className="gallery-modal-head">
                                    <button type="button" className="gallery-modal-arrow" aria-label="Previous package" onClick={() => step(-1)}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                                    </button>
                                    <div className="gallery-modal-title gallery-modal-swap">
                                        <h2>Package {pkg.number}</h2>
                                        <span>{pkg.name}</span>
                                    </div>
                                    <button type="button" className="gallery-modal-arrow" aria-label="Next package" onClick={() => step(1)}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                                    </button>
                                    <button ref={closeBtnRef} type="button" className="gallery-modal-close" aria-label="Close gallery" onClick={close}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                    </button>
                                </header>
                                <div className="gallery-modal-body" data-lenis-prevent>
                                    <div className="gallery-modal-grid gallery-modal-swap">
                                        {photos.map((photo, i) => (
                                            <button key={photo.src} type="button" className="gallery-modal-photo" onClick={() => setPhotoIndex(i)} aria-label={`View photo: ${photo.alt}`}>
                                                <img src={photo.src} alt="" width={photo.width} height={photo.height} loading="lazy" />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="gallery-modal-foot gallery-modal-swap">
                                        <TransitionLink href={pkg.href} className="btn-text">
                                            See what&apos;s included in Package {pkg.number}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                        </TransitionLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Lightbox photos={photos} index={photoIndex} onIndexChange={setPhotoIndex} onClose={() => setPhotoIndex(null)} />
                    </div>,
                    document.body
                )}
        </>
    );
}
