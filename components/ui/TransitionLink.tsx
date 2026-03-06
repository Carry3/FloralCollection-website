"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import { ComponentProps } from "react";

type TransitionLinkProps = ComponentProps<typeof Link>;

export function TransitionLink({ href, onClick, children, ...rest }: TransitionLinkProps) {
    const router = useRouter();
    const { setNavLoading } = usePreloader();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        const target = typeof href === "string" ? href : href.pathname ?? "";
        const targetPath = target.split("#")[0] || "/";
        if (targetPath && targetPath !== window.location.pathname) {
            e.preventDefault();
            setNavLoading(true);
            router.push(href as string);
        }
    };

    return (
        <Link href={href} onClick={handleClick} {...rest}>
            {children}
        </Link>
    );
}
