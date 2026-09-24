"use client";
import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import { LOGO_SVG } from "@/lib/logo";
import { getSectionsForPath } from "@/lib/page-sections";
import { NAV_ITEMS } from "@/lib/navigation";
import { useScrollLock } from "@/hooks/useScrollLock";
import { BRAND_COLOR_AT_S, BRAND_COLOR_S, BRAND_COMPACT_PRE_S, BRAND_EASE_GSAP, BRAND_TRANSITION_S } from "@/lib/brand-transition";
import { CONTACT } from "@/lib/site";
import gsap from "gsap";

const HEADER_SCROLL_OFFSET = 100;
/** 加载时品牌居中放大的最大倍数 */
const LOADING_BRAND_SCALE = 2.5;

export default function Header() {
    const { toggle } = useTheme();
    const { preloaderDone, navLoading, setNavLoading } = usePreloader();
    const pathname = usePathname();
    const isHome = pathname === "/";
    const [scrolled, setScrolled] = useState(false);
    const [onDark, setOnDark] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [subNavVisible, setSubNavVisible] = useState(false);
    const menuWrapperRef = useRef<HTMLDivElement>(null);
    const menuTriggerRef = useRef<HTMLButtonElement>(null);

    useLayoutEffect(() => {
        if (!menuTriggerRef.current) return;
        const { width, height } = menuTriggerRef.current.getBoundingClientRect();
        const root = document.documentElement;
        root.style.setProperty("--mtrig-w", `${width}px`);
        root.style.setProperty("--mtrig-h", `${height}px`);
    }, []);

    // 菜单打开时是模态的：遮罩拦截页面点击（点遮罩关闭），锁定滚动，Esc 关闭
    useScrollLock(menuOpen);
    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [menuOpen]);
    const sections = getSectionsForPath(pathname);
    const hasSubNav = sections.length > 0;
    const [activeSectionId, setActiveSectionId] = useState<string | null>(sections[0]?.id ?? null);

    useEffect(() => {
        const handler = () => {
            const scrollY = window.scrollY;
            setScrolled(scrollY > 50);

            const homeHero = document.querySelector<HTMLElement>(".hero");
            if (homeHero) {
                setOnDark(scrollY < homeHero.offsetHeight - 100);
                return;
            }

            const subHero = document.querySelector<HTMLElement>(".subpage-hero");
            if (subHero) {
                const stickyEnd = subHero.offsetHeight - window.innerHeight;
                setOnDark(scrollY < stickyEnd - 50);
                return;
            }

            setOnDark(false);
        };
        window.addEventListener("scroll", handler, { passive: true });
        handler();
        return () => window.removeEventListener("scroll", handler);
    }, [pathname]);

    const updateActiveSection = useCallback(() => {
        if (sections.length === 0) return;
        let current: string | null = null;
        for (const s of sections) {
            const el = document.getElementById(s.id);
            if (el && el.getBoundingClientRect().top <= HEADER_SCROLL_OFFSET) current = s.id;
        }
        if (current === null && sections[0]) current = sections[0].id;
        setActiveSectionId((prev) => (prev !== current ? current : prev));
    }, [sections]);

    useEffect(() => {
        const next = getSectionsForPath(pathname);
        setActiveSectionId(next[0]?.id ?? null);
    }, [pathname]);

    useEffect(() => {
        if (!hasSubNav) return;
        updateActiveSection();
        window.addEventListener("scroll", updateActiveSection, { passive: true });
        return () => window.removeEventListener("scroll", updateActiveSection);
    }, [hasSubNav, updateActiveSection]);

    const handleSectionClick = (id: string) => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    useEffect(() => {
        if (!navLoading) return;
        setSubNavVisible(false);
        const t = setTimeout(() => setNavLoading(false), 2300);
        return () => clearTimeout(t);
    }, [pathname, navLoading, setNavLoading]);

    useEffect(() => {
        const onComplete = () => setSubNavVisible(true);
        window.addEventListener("pageTransitionComplete", onComplete);
        return () => window.removeEventListener("pageTransitionComplete", onComplete);
    }, []);

    const loadingActive = !preloaderDone || navLoading;

    const brandAnimating = useRef(false);
    const wasLoadingActive = useRef(loadingActive);

    useLayoutEffect(() => {
        const brand = document.querySelector<HTMLElement>('.header-brand');
        if (!brand) return;

        if (loadingActive) {
            // 加载中：品牌居中放大。放大倍数按屏宽收敛（手机上 2.5 倍会超出屏幕，看起来不居中）。
            // Cormorant 字体晚于首帧加载会让文字变宽、中心点漂移，因此字体就绪 / 尺寸变化时都重算。
            const recenter = () => {
                brand.style.transition = 'none';
                brand.style.transform = 'none';
                void brand.offsetHeight;
                const rect = brand.getBoundingClientRect();
                const scale = Math.min(LOADING_BRAND_SCALE, (window.innerWidth * 0.84) / rect.width);
                const dx = window.innerWidth / 2 - (rect.left + rect.width / 2);
                const dy = window.innerHeight / 2 - (rect.top + rect.height / 2);
                brand.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
                brand.style.willChange = 'transform';
            };
            recenter();

            let disposed = false;
            document.fonts?.ready.then(() => {
                if (!disposed) recenter();
            });
            const ro = new ResizeObserver(() => {
                if (!disposed) recenter();
            });
            ro.observe(brand);
            window.addEventListener('resize', recenter);
            wasLoadingActive.current = loadingActive;
            return () => {
                disposed = true;
                ro.disconnect();
                window.removeEventListener('resize', recenter);
            };
        } else if (wasLoadingActive.current && !brandAnimating.current) {
            brandAnimating.current = true;

            const logoStrip = brand.querySelector<HTMLElement>('.header-brand-logo-strip');
            const textScroll = brand.querySelector<HTMLElement>('.header-brand-text-scroll');
            const logo = brand.querySelector<HTMLElement>('.header-brand-logo-viewport');
            const text = brand.querySelector<HTMLElement>('.header-brand-text');
            if (!logo || !text) {
                brandAnimating.current = false;
                return;
            }
            if (logoStrip) logoStrip.style.animation = 'none';
            if (textScroll) textScroll.style.animation = 'none';

            // ── FLIP：以 logo 为锚点，从加载时的视觉位置飞到导航栏里的最终位置 ──
            // First：加载态（此刻 DOM 里仍带着居中放大的 transform）
            // 临时还原成纯加载态的 class（去掉 on-dark 等，否则它们会盖过加载色）
            const headerEl = brand.closest<HTMLElement>('.header');
            const finalClassName = headerEl?.className ?? '';
            if (headerEl) headerEl.className = 'header visible loading-active';
            const firstLogo = logo.getBoundingClientRect();
            const loadingColor = getComputedStyle(brand).color;
            if (headerEl) headerEl.className = finalClassName;

            // Last：最终布局
            brand.style.cssText = 'transition:none !important;';
            // 手机端导航栏不显示文字 —— 让文字暂时脱离布局、留在 logo 旁边，先淡出再飞行
            const textHiddenInHeader = getComputedStyle(text).display === 'none';
            if (textHiddenInHeader) {
                text.style.cssText = 'display:flex;position:absolute;left:100%;top:50%;margin-left:12px;transform:translateY(-50%);white-space:nowrap;';
            }
            void brand.offsetHeight;
            const brandRect = brand.getBoundingClientRect();
            const lastLogo = logo.getBoundingClientRect();
            const targetColor = getComputedStyle(brand).color;

            const scale = firstLogo.height / lastLogo.height;
            const originX = lastLogo.left + lastLogo.width / 2 - brandRect.left;
            const originY = lastLogo.top + lastLogo.height / 2 - brandRect.top;
            const dx = firstLogo.left + firstLogo.width / 2 - (lastLogo.left + lastLogo.width / 2);
            const dy = firstLogo.top + firstLogo.height / 2 - (lastLogo.top + lastLogo.height / 2);

            // 落位期间保持加载时的颜色，固定到导航栏之后再变色
            gsap.set(brand, { transformOrigin: `${originX}px ${originY}px`, x: dx, y: dy, scale, color: loadingColor });

            const finish = () => {
                gsap.set(brand, { clearProps: 'all' });
                brand.style.cssText = '';
                text.style.cssText = '';
                if (logoStrip) logoStrip.style.animation = '';
                if (textScroll) textScroll.style.animation = '';
                brandAnimating.current = false;
            };

            const tl = gsap.timeline({ onComplete: finish });
            // 小屏导航栏只有 logo 图标：先让文字淡出、图标平移到屏幕正中，再上移（幕布同样顺延，见 Preloader）
            const pre = textHiddenInHeader ? BRAND_COMPACT_PRE_S : 0;
            if (textHiddenInHeader) {
                tl.to(text, { opacity: 0, duration: pre * 0.6, ease: 'power1.out' }, 0)
                    .to(brand, { x: window.innerWidth / 2 - (lastLogo.left + lastLogo.width / 2), duration: pre * 0.8, ease: 'power2.inOut' }, pre * 0.2);
            }
            tl.to(brand, { x: 0, y: 0, scale: 1, duration: BRAND_TRANSITION_S, ease: BRAND_EASE_GSAP }, pre)
                .add(() => { window.dispatchEvent(new Event('pageTransitionComplete')); }, pre + BRAND_TRANSITION_S)
                // 等幕布越过落位后的 logo 再变色，否则会在幕布上变成白色、看不清
                .to(brand, { color: targetColor, duration: BRAND_COLOR_S, ease: 'power1.out' }, pre + BRAND_COLOR_AT_S);
        }
        wasLoadingActive.current = loadingActive;
    });

    const headerClass = [
        "header",
        (preloaderDone || navLoading) ? "visible" : "",
        loadingActive ? "loading-active" : "",
        (!loadingActive && scrolled) ? "scrolled" : "",
        (!loadingActive && onDark) ? "on-dark" : "",
        hasSubNav ? "has-sub-nav" : "",
        menuOpen ? "menu-open" : "",
    ].filter(Boolean).join(" ");

    return (
        <>
            <header
                id="header"
                className={headerClass}
                onClick={(e) => {
                    // 菜单打开时点导航栏其他区域 = 点遮罩，关闭菜单
                    if (menuOpen && !menuWrapperRef.current?.contains(e.target as Node)) setMenuOpen(false);
                }}
            >
                <div className="header-left">
                    <div
                        ref={menuWrapperRef}
                        className={`menu-wrapper${menuOpen ? " is-open" : ""}`}
                    >
                        <div className="menu-bg" aria-hidden="true" />

                        <button
                            ref={menuTriggerRef}
                            className="menu-trigger"
                            onClick={() => setMenuOpen((p) => !p)}
                            aria-label="Toggle menu"
                            aria-expanded={menuOpen}
                        >
                            <div className="menu-btn-icon">
                                <svg className="icon-hamburger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
                                <svg className="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            </div>
                            <span className="menu-trigger-label">MENU</span>
                        </button>

                        <div className="menu-content" aria-hidden={!menuOpen}>
                            <nav className="menu-nav">
                                {NAV_ITEMS.map((item) => (
                                    <TransitionLink
                                        key={item.label}
                                        href={item.href}
                                        className="menu-item menu-item-header"
                                        aria-current={pathname === item.href ? "page" : undefined}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <span className="menu-item-title">{item.label}</span>
                                    </TransitionLink>
                                ))}
                            </nav>
                            <div className="menu-footer">
                                <p>{CONTACT.email}</p>
                                <p>{CONTACT.phone}</p>
                            </div>
                        </div>
                    </div>
                </div >

                <div className="header-center">
                    <TransitionLink
                        href="/"
                        className="header-brand"
                        onClick={(e) => {
                            if (isHome) {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                        }}
                    >
                        <span className="header-brand-logo-viewport">
                            <span className="header-brand-logo-strip">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <span key={i} className="header-brand-logo" dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
                                ))}
                            </span>
                        </span>
                        <span className="header-brand-text">
                            <span className="header-brand-text-scroll">
                                {[1, 2, 3, 4, 5, 6].flatMap((i) => [
                                    <span key={`${i}-floral`}>The Floral</span>,
                                    <span key={`${i}-coll`}>Collection</span>,
                                ])}
                            </span>
                        </span>
                    </TransitionLink>
                    {hasSubNav && (
                        <nav className={`header-sub-nav${subNavVisible ? " visible" : ""}`} aria-label="Page sections">
                            <div className="header-sub-nav-tabs">
                                {sections.map(({ id, label }) => (
                                    <button
                                        key={id}
                                        type="button"
                                        className={`header-sub-nav-tab ${activeSectionId === id ? "active" : ""}`}
                                        onClick={() => handleSectionClick(id)}
                                        data-label={label}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </nav>
                    )}
                </div>

                <div className="header-right">
                    <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                        </svg>
                    </button>
                    <button type="button" className="header-cta" aria-label="Contact us" onClick={() => setContactOpen(true)}>
                        <span className="header-cta-label">Contact Us</span>
                        <svg className="header-cta-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        {/* 手机端只显示这个图标（打开电话 / 短信 / 邮件联系弹窗） */}
                        <svg className="header-cta-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.2 9.2 0 0 1-3.8-.8L3 20.5l1.4-4.6A8 8 0 0 1 3 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z" />
                            <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" strokeWidth="2.2" />
                        </svg>
                    </button>
                </div>
            </header>
            <div
                className={`menu-blur-overlay${menuOpen ? " active" : ""}`}
                aria-hidden="true"
                onClick={() => setMenuOpen(false)}
            />

            {contactOpen && (
                <div className="contact-modal-overlay" onClick={() => setContactOpen(false)}>
                    <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="contact-modal-close"
                            onClick={() => setContactOpen(false)}
                            aria-label="Close contact info"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                        <h3 className="contact-modal-title">Get in Touch</h3>
                        <div className="contact-modal-items">
                            <a href={CONTACT.phoneHref} className="contact-modal-item">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                                </svg>
                                <div className="contact-modal-item-text">
                                    <span className="contact-modal-label">Call Us</span>
                                    <span className="contact-modal-value">{CONTACT.phone}</span>
                                </div>
                            </a>
                            <a href={CONTACT.smsHref} className="contact-modal-item">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                                </svg>
                                <div className="contact-modal-item-text">
                                    <span className="contact-modal-label">Text Us</span>
                                    <span className="contact-modal-value">{CONTACT.phone}</span>
                                </div>
                            </a>
                            <a href={`mailto:${CONTACT.email}`} className="contact-modal-item">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                <div className="contact-modal-item-text">
                                    <span className="contact-modal-label">Email</span>
                                    <span className="contact-modal-value">
                                        {/* 允许在 @ 前换行，长邮箱在窄屏上断得更自然 */}
                                        {CONTACT.email.split("@")[0]}<wbr />@{CONTACT.email.split("@")[1]}
                                    </span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
