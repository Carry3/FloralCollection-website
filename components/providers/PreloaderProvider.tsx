"use client";

import { createContext, useContext, useState, ReactNode } from "react";

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
    const [preloaderDone, setPreloaderDone] = useState(false);
    const [navLoading, setNavLoading] = useState(false);
    return (
        <PreloaderContext.Provider value={{ preloaderDone, setPreloaderDone, navLoading, setNavLoading }}>
            {children}
        </PreloaderContext.Provider>
    );
}
