/**
 * Section anchors for sub-pages. Used by Header to show a tag list below the logo
 * and for scroll-spy + click-to-scroll.
 */
export type PageSection = { id: string; label: string };

export const PAGE_SECTIONS: Record<string, PageSection[]> = {
    "/about": [
        { id: "abt-story", label: "Our Story" },
        { id: "abt-team", label: "Our Team" },
        { id: "abt-tech", label: "Technology" },
        { id: "abt-markets", label: "Markets" },
        { id: "abt-licensing", label: "Licensing" },
    ],
    "/technology": [
        { id: "tech-overview", label: "Overview" },
        { id: "tech-platform", label: "Platform" },
    ],
    "/markets": [
        { id: "markets-overview", label: "Overview" },
        { id: "markets-areas", label: "Areas We Serve" },
    ],
};

export function getSectionsForPath(pathname: string): PageSection[] {
    return PAGE_SECTIONS[pathname] ?? [];
}
