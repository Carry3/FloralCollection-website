"use client";

import { useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import { BRAND_COMPACT_PRE_S, BRAND_COMPACT_QUERY, CURTAIN_DELAY_S, CURTAIN_EASE_CSS, CURTAIN_S } from "@/lib/brand-transition";

const MIN_LOADING_MS = 2300;
const MAX_LOADING_MS = 2500;

function preloadResources(): Promise<void> {
    const allImages = typeof document !== "undefined" ? document.querySelectorAll<HTMLImageElement>("img[src]") : [];
    const criticalImages = Array.from(allImages).filter(img =>
        img.fetchPriority === "high" ||
        img.getAttribute("data-preload") === "true" ||
        img.closest("#heroSection")
    );
    const promises = criticalImages.map(
        (img) =>
            new Promise<void>((resolve) => {
                if (img.complete) return resolve();
                img.addEventListener("load", () => resolve(), { once: true });
                img.addEventListener("error", () => resolve(), { once: true });
            })
    );
    const fontsReady =
        typeof document !== "undefined" && document.fonts?.ready ? document.fonts.ready : Promise.resolve();
    return Promise.all([...promises, fontsReady]) as unknown as Promise<void>;
}

export default function Preloader() {
    const { setPreloaderDone, navLoading } = usePreloader();
    const curtainLeftRef = useRef<HTMLDivElement>(null);
    const curtainRightRef = useRef<HTMLDivElement>(null);
    // 追踪 navLoading 前一个值，用来检测 true→false 的边沿
    const prevNavLoading = useRef(false);
    // 正在运行的幕布动画（WAAPI），用于在导航复位时取消
    const curtainAnims = useRef<Animation[]>([]);

    /** 统一的"展开幕布"逻辑
       用 Web Animations API（浏览器驱动），不用 GSAP：加载期间 GSAP 活动为零，
       GSAP ticker（由 Lenis RAF 喂动、lagSmoothing(0)）会休眠，在 loading→done 边沿
       新建的 GSAP tween 在 Safari 会卡顿/掉帧。WAAPI 免疫。 */
    const openCurtains = useCallback(() => {
        const left = curtainLeftRef.current;
        const right = curtainRightRef.current;
        if (!left || !right) return;

        // 取消上一轮可能残留的动画
        curtainAnims.current.forEach((a) => a.cancel());
        curtainAnims.current = [];

        // 确保 overlay 可见
        const overlay = left.parentElement!;
        overlay.style.visibility = "";

        const timing: KeyframeAnimationOptions = {
            // 跟在 logo 后面出发（见 lib/brand-transition.ts）；小屏 logo 先有一段"文字淡出 + 居中"，幕布一起顺延
            delay: (CURTAIN_DELAY_S + (window.matchMedia(BRAND_COMPACT_QUERY).matches ? BRAND_COMPACT_PRE_S : 0)) * 1000,
            duration: CURTAIN_S * 1000,
            easing: CURTAIN_EASE_CSS,
            fill: "both",
        };
        const aLeft = left.animate(
            [{ transform: "translateY(0%)" }, { transform: "translateY(-100%)" }],
            timing
        );
        const aRight = right.animate(
            [{ transform: "translateY(0%)" }, { transform: "translateY(100%)" }],
            timing
        );
        curtainAnims.current = [aLeft, aRight];
        aRight.onfinish = () => {
            overlay.style.visibility = "hidden";
            document.body.style.overflow = "";
        };
    }, []);

    useEffect(() => {
        const overlay = document.getElementById("first-paint-overlay");
        if (overlay) overlay.style.display = "none";
    }, []);

    /* 初次加载：等待资源 + 最短时间，然后展开幕布 */
    useEffect(() => {
        let isCancelled = false;
        document.body.style.overflow = "hidden";

        const run = async () => {
            const minDelay = new Promise<void>((r) => setTimeout(r, MIN_LOADING_MS));
            const maxTimeout = new Promise<void>((r) => setTimeout(r, MAX_LOADING_MS));
            await Promise.race([
                Promise.all([preloadResources(), minDelay]),
                maxTimeout,
            ]);
            if (isCancelled) return;
            setPreloaderDone(true);
            openCurtains();
        };
        run();
        return () => {
            isCancelled = true;
            document.body.style.overflow = "";
        };
    }, [setPreloaderDone, openCurtains]);

    /* 导航：navLoading true→覆盖，true→false→展开
       用 useLayoutEffect（绘制前）盖幕布，与 Header 居中 logo 的 useLayoutEffect 同一帧完成，
       否则会先画出"大 logo 叠在旧页面、幕布未盖"的一帧，导致跳转时 logo 闪现/移动。 */
    useLayoutEffect(() => {
        const left = curtainLeftRef.current;
        const right = curtainRightRef.current;
        if (!left || !right) return;

        if (navLoading) {
            // 导航开始：立即将幕布复位至全屏覆盖
            const overlay = left.parentElement!;
            overlay.style.visibility = "";
            curtainAnims.current.forEach((a) => a.cancel());
            curtainAnims.current = [];
            left.style.transform = "translateY(0%)";
            right.style.transform = "translateY(0%)";
        } else if (prevNavLoading.current) {
            // navLoading: true → false，展开幕布
            openCurtains();
        }

        prevNavLoading.current = navLoading;
    }, [navLoading, openCurtains]);

    return (
        <div className="loading-overlay" aria-hidden="true">
            <div ref={curtainLeftRef} className="curtain-left" />
            <div ref={curtainRightRef} className="curtain-right" />
        </div>
    );
}
