"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import { useLenis } from "@/hooks/useLenis";
import { ComponentProps } from "react";

type TransitionLinkProps = ComponentProps<typeof Link>;

export function TransitionLink({ href, onClick, children, ...rest }: TransitionLinkProps) {
    const router = useRouter();
    const { setNavLoading } = usePreloader();
    const lenis = useLenis();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        const target = typeof href === "string" ? href : href.pathname ?? "";
        const targetPath = target.split("#")[0] || "/";
        if (targetPath && targetPath !== window.location.pathname) {
            e.preventDefault();
            // Scroll to top immediately before navigation so the new page starts at 0
            if (lenis) {
                lenis.scrollTo(0, { immediate: true })
            } else {
                window.scrollTo(0, 0)
            }
            setNavLoading(true);
            requestAnimationFrame(() => router.push(href as string));
        }
    };

    return (
        <Link href={href} onClick={handleClick} {...rest}>
            {children}
        </Link>
    );
}
