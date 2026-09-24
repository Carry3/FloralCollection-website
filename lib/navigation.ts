export interface NavItem {
    label: string;
    href: string;
    children?: { label: string; href: string }[];
}

export const NAV_ITEMS: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Package 1", href: "/classic" },
    { label: "Package 2", href: "/signature" },
    { label: "Package 3", href: "/luxe" },
    { label: "Package 4", href: "/grand" },
    { label: "About Us & Our Flowers", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
];
