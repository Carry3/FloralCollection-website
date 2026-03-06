"use client";
import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import { LOGO_SVG } from "@/lib/logo";
import { getSectionsForPath } from "@/lib/page-sections";
import { NAV_ITEMS } from "@/lib/navigation";
import gsap from "gsap";

const HEADER_SCROLL_OFFSET = 100;

export default function Header() {
    const { toggle } = useTheme();
    const { preloaderDone, navLoading, setNavLoading } = usePreloader();
    const pathname = usePathname();
    const isHome = pathname === "/";
    const [scrolled, setScrolled] = useState(false);
    const [onDark, setOnDark] = useState(isHome);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuWrapperRef = useRef<HTMLDivElement>(null);
    const menuTriggerRef = useRef<HTMLButtonElement>(null);

    /* Measure trigger BEFORE first paint so menu-bg initial size is always exact */
    useLayoutEffect(() => {
        if (!menuTriggerRef.current) return;
        const { width, height } = menuTriggerRef.current.getBoundingClientRect();
        const root = document.documentElement;
        root.style.setProperty("--mtrig-w", `${width}px`);
        root.style.setProperty("--mtrig-h", `${height}px`);
    }, []);

    /* Close menu when clicking outside the wrapper */
    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e: MouseEvent) => {
            if (menuWrapperRef.current && !menuWrapperRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [menuOpen]);
    const sections = getSectionsForPath(pathname);
    const hasSubNav = sections.length > 0;
    const [activeSectionId, setActiveSectionId] = useState<string | null>(sections[0]?.id ?? null);

    useEffect(() => {
        const handler = () => {
            const scrollY = window.scrollY;
            setScrolled(scrollY > 50);
            if (isHome) {
                const heroEl = document.querySelector<HTMLElement>(".hero");
                const heroH = heroEl?.offsetHeight ?? 0;
                setOnDark(scrollY < heroH - 100);
            }
        };
        window.addEventListener("scroll", handler, { passive: true });
        handler();
        return () => window.removeEventListener("scroll", handler);
    }, [isHome]);

    /* Scroll spy: 哪个 section 的顶部已滚过导航下方，就高亮哪个 */
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
        const t = setTimeout(() => setNavLoading(false), 1800);
        return () => clearTimeout(t);
    }, [pathname, navLoading, setNavLoading]);

    const loadingActive = !preloaderDone || navLoading;

    /* ── Brand positioning: JS-driven to bypass containing-block issues ── */
    const brandAnimating = useRef(false);
    const wasLoadingActive = useRef(loadingActive);
    const brandNaturalCenter = useRef<{ x: number; y: number } | null>(null);

    useLayoutEffect(() => {
        const brand = document.querySelector<HTMLElement>('.header-brand');
        if (!brand) return;

        if (loadingActive) {
            if (!brandNaturalCenter.current) {
                brand.style.transition = 'none';
                brand.style.transform = 'none';
                void brand.offsetHeight;
                const rect = brand.getBoundingClientRect();
                brandNaturalCenter.current = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                };
            }
            const { x: natX, y: natY } = brandNaturalCenter.current;
            const dx = window.innerWidth / 2 - natX;
            const dy = window.innerHeight / 2 - natY;
            brand.style.transition = 'none';
            brand.style.transform = `translate(${dx}px, ${dy}px) scale(2.5)`;
            brand.style.willChange = 'transform';
        } else if (wasLoadingActive.current && !brandAnimating.current) {
            brandAnimating.current = true;

            brand.style.transform = 'none';
            void brand.offsetHeight;
            const newRect = brand.getBoundingClientRect();
            const newCX = newRect.left + newRect.width / 2;
            const newCY = newRect.top + newRect.height / 2;
            const fromDx = window.innerWidth / 2 - newCX;
            const fromDy = window.innerHeight / 2 - newCY;

            gsap.fromTo(brand,
                { x: fromDx, y: fromDy, scale: 2.5 },
                {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.9,
                    ease: 'power3.inOut',
                    onComplete: () => {
                        gsap.set(brand, { clearProps: 'all' });
                        brandAnimating.current = false;
                        brandNaturalCenter.current = null;
                    },
                },
            );
        }
        wasLoadingActive.current = loadingActive;
    });

    const headerClass = [
        "header",
        (preloaderDone || navLoading) ? "visible" : "",
        loadingActive ? "loading-active" : "",
        (!loadingActive && scrolled) ? "scrolled" : "",
        (!loadingActive && isHome && onDark) ? "on-dark" : "",
        hasSubNav ? "has-sub-nav" : "",
    ].filter(Boolean).join(" ");

    return (
        <>
            <header id="header" className={headerClass}>
                <div className="header-left">
                    {/* ── Menu wrapper: the expanding pill lives here ── */}
                    <div
                        ref={menuWrapperRef}
                        className={`menu-wrapper${menuOpen ? " is-open" : ""}`}
                    >
                        {/* Background pill — starts as button size, expands into modal */}
                        <div className="menu-bg" aria-hidden="true" />

                        {/* Trigger: always on top */}
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

                        {/* Menu content — revealed after expansion */}
                        <div className="menu-content" aria-hidden={!menuOpen}>
                            <nav className="menu-nav">
                                {NAV_ITEMS.map((item) => (
                                    <TransitionLink
                                        key={item.label}
                                        href={item.href}
                                        className="menu-item menu-item-header"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <span className="menu-item-title">{item.label}</span>
                                    </TransitionLink>
                                ))}
                            </nav>
                            <div className="menu-footer">
                                <p>info@floralcollection.com</p>
                                <p>(800) 123-4567</p>
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
                        <nav className="header-sub-nav visible" aria-label="Page sections">
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
                    <Link href="/contact" className="header-cta">
                        Contact Us
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </Link>
                </div>
            </header>
            {/* Page blur overlay — appears behind header, blurs page content when menu is open */}
            <div className={`menu-blur-overlay${menuOpen ? " active" : ""}`} aria-hidden="true" />
        </>
    );
}
