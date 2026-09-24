import type { ReactNode } from "react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { PACKAGES } from "@/lib/packages";

export interface FaqItem {
    q: string;
    /** 纯文本版答案，用于 FAQPage 结构化数据 */
    text: string;
    a: ReactNode;
}

export const FAQS: FaqItem[] = [
    {
        q: "What is included in each wedding package?",
        text: "Each package includes a curated selection of floral décor and rental pieces designed for a specific level of coverage and scale. View the complete inclusions for each collection: Package 1, Package 2, Package 3, Package 4.",
        a: (
            <>
                <p>
                    Each package includes a curated selection of floral décor and rental pieces designed for a specific
                    level of coverage and scale. View the complete inclusions for each collection below:
                </p>
                <ul className="faq-package-links">
                    {PACKAGES.map((pkg) => (
                        <li key={pkg.id}>
                            <TransitionLink href={pkg.href}>Package {pkg.number}</TransitionLink>
                        </li>
                    ))}
                </ul>
            </>
        ),
    },
    {
        q: "Can I customize my package or add items from another collection?",
        text: "Each package includes a predetermined selection and quantity of décor items. Items cannot be exchanged or combined between packages.",
        a: <p>Each package includes a predetermined selection and quantity of décor items. Items cannot be exchanged or combined between packages.</p>,
    },
    {
        q: "Can I upgrade my package after booking?",
        text: "Yes. Package upgrades may be requested after booking, subject to the availability of our staff, floral pieces, and rental inventory.",
        a: <p>Yes. Package upgrades may be requested after booking, subject to the availability of our staff, floral pieces, and rental inventory.</p>,
    },
    {
        q: "Can the design be tailored to my venue and inspiration photos?",
        text: "Yes. Our wedding designer will curate the overall design to complement your venue, wedding vision, and inspiration photos while working within the inclusions of your selected package.",
        a: <p>Yes. Our wedding designer will curate the overall design to complement your venue, wedding vision, and inspiration photos while working within the inclusions of your selected package.</p>,
    },
    {
        q: "Will my décor look exactly like the photographs on your website?",
        text: "All photographs on our website feature real events designed by The Floral Collection. Your décor will reflect the same quality and aesthetic, although the final arrangement may vary based on your venue, layout, color palette, and selected package.",
        a: <p>All photographs on our website feature real events designed by The Floral Collection. Your décor will reflect the same quality and aesthetic, although the final arrangement may vary based on your venue, layout, color palette, and selected package.</p>,
    },
    {
        q: "Are delivery, professional setup, and post-event removal included?",
        text: "Yes. Delivery, professional installation, and post-event removal are included in the price of every package.",
        a: <p>Yes. Delivery, professional installation, and post-event removal are included in the price of every package.</p>,
    },
    {
        q: "Do you provide venue visits, linens, or table settings?",
        text: "We conduct a venue visit when needed to assess the space and help ensure a seamless installation. At this time, we do not provide linens, dinnerware, glassware, flatware, or other table-setting rentals.",
        a: <p>We conduct a venue visit when needed to assess the space and help ensure a seamless installation. At this time, we do not provide linens, dinnerware, glassware, flatware, or other table-setting rentals.</p>,
    },
    {
        q: "Can I modify, reschedule, or cancel my booking?",
        text: "All deposits are nonrefundable. Event dates may be rescheduled, and packages may be upgraded, subject to availability. Additional terms or fees may apply depending on the requested change.",
        a: <p>All deposits are nonrefundable. Event dates may be rescheduled, and packages may be upgraded, subject to availability. Additional terms or fees may apply depending on the requested change.</p>,
    },
    {
        q: "What is required to reserve my wedding date?",
        text: "A 50% nonrefundable deposit and a signed agreement are required to secure your wedding date. Dates are not reserved until both have been received.",
        a: <p>A <strong>50% nonrefundable deposit</strong> and a signed agreement are required to secure your wedding date. Dates are not reserved until both have been received.</p>,
    },
    {
        q: "How do payments and processing fees work?",
        text: "The remaining 50% balance must be paid before the wedding date according to the payment deadline stated in your agreement. Credit-card payments are subject to a 2.5% processing fee.",
        a: <p>The remaining 50% balance must be paid before the wedding date according to the payment deadline stated in your agreement. Credit-card payments are subject to a <strong>2.5% processing fee</strong>.</p>,
    },
];
