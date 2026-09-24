"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { skipsIntro } from "@/lib/brand-transition";

type PreloaderContextValue = {
    preloaderDone: boolean;
    setPreloaderDone: (v: boolean) => void;
    navLoading: boolean;
    setNavLoading: (v: boolean) => void;
};

const PreloaderContext = createContext<PreloaderContextValue>({
    preloaderDone: false,
    setPreloaderDone: () => {},
    navLoading: false,
    setNavLoading: () => {},
});

export function usePreloader() {
    return useContext(PreloaderContext);
}

export function PreloaderProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    // 跳过开场的页面一开始就算"加载完成"（服务端渲染同样如此，导航栏直接是最终状态）
    const [preloaderDone, setPreloaderDone] = useState(() => skipsIntro(pathname));
    const [navLoading, setNavLoading] = useState(false);
    return (
        <PreloaderContext.Provider value={{ preloaderDone, setPreloaderDone, navLoading, setNavLoading }}>
            {children}
        </PreloaderContext.Provider>
    );
}
