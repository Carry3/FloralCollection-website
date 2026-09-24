"use client";

import { useEffect, useRef } from "react";

/**
 * 触屏设备没有 hover —— 改为「滚动到屏幕中部的卡片自动激活」：
 * 给进入视口中间带的元素加上 `is-active`，CSS 里用它复现桌面端的 hover 效果。
 * 只在 (hover: none) 的设备上启用，桌面端仍然走 :hover。
 */
export default function ActiveOnScroll({
    selector,
    className,
    children,
}: {
    selector: string;
    className?: string;
    children: React.ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = ref.current;
        if (!root || !window.matchMedia("(hover: none)").matches) return;
        const items = Array.from(root.querySelectorAll<HTMLElement>(selector));
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) entry.target.classList.toggle("is-active", entry.isIntersecting);
            },
            // 视口上下各收进 45%，只有穿过屏幕正中间那条带的卡片才激活（一次一张）
            { rootMargin: "-45% 0px -45% 0px" }
        );
        items.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, [selector]);

    return <div ref={ref} className={className}>{children}</div>;
}
