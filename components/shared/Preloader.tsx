"use client";

import { useEffect, useState } from "react";
import { usePreloader } from "@/components/providers/PreloaderProvider";

const MIN_LOADING_MS = 1600;
// 缩短兜底时间：保证在 slot machine 旋转 (1.8s) 结束后立刻切入，不再傻等多余的网络资源
const MAX_LOADING_MS = 1800;

function preloadResources(): Promise<void> {
    const allImages = typeof document !== "undefined" ? document.querySelectorAll<HTMLImageElement>("img[src]") : [];
    // 仅等待首屏关键图片加载，避免遭到非首屏（如 Services 下的大图）阻塞
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
    const [overlayHidden, setOverlayHidden] = useState(false);

    useEffect(() => {
        const overlay = document.getElementById("first-paint-overlay");
        if (overlay) overlay.style.display = "none";
    }, []);

    useEffect(() => {
        let isCancelled = false;
        // 开屏期间禁止页面滚动
        document.body.style.overflow = "hidden";

        const run = async () => {
            const minDelay = new Promise<void>((r) => setTimeout(r, MIN_LOADING_MS));
            const maxTimeout = new Promise<void>((r) => setTimeout(r, MAX_LOADING_MS));
            // 资源加载完成或超时，以先到为准
            await Promise.race([
                Promise.all([preloadResources(), minDelay]),
                maxTimeout,
            ]);
            if (isCancelled) return;
            document.body.style.overflow = "";
            setPreloaderDone(true);
            setOverlayHidden(true);
        };
        run();
        return () => {
            isCancelled = true;
            document.body.style.overflow = "";
        };
    }, [setPreloaderDone]);

    return (
        <div
            className={`loading-overlay${overlayHidden && !navLoading ? " hidden" : ""}`}
            aria-hidden="true"
        />
    );
}
