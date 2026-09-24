"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
    const pathname = usePathname();
    if (pathname === "/contact") return null;
    return <Footer />;
}
