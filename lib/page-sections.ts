/**
 * Section anchors for sub-pages. Used by Header to show a tag list below the logo
 * and for scroll-spy + click-to-scroll.
 */
export type PageSection = { id: string; label: string };

export const PAGE_SECTIONS: Record<string, PageSection[]> = {
    "/about": [
        { id: "abt-who", label: "Who We Are" },
        { id: "abt-flowers", label: "Our Flowers" },
        { id: "abt-team", label: "Our Team" },
    ],
};

export function getSectionsForPath(pathname: string): PageSection[] {
    return PAGE_SECTIONS[pathname] ?? [];
}
