export interface NavItem {
    label: string;
    href: string;
    children?: { label: string; href: string }[];
}

export const NAV_ITEMS: NavItem[] = [
    { label: "Essential Package", href: "/essential" },
    { label: "Plus Package", href: "/plus" },
    { label: "Luxe Package", href: "/luxe" },
    { label: "Elite Package", href: "/elite" },
    { label: "About Us", href: "/about" },
    { label: "Technology", href: "/technology" },
    { label: "Markets We Serve", href: "/markets" },
    { label: "Contact", href: "/contact" },
];
