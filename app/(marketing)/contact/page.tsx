import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import SubpageSection from "@/components/shared/SubpageSection";

export const metadata: Metadata = { title: "Contact", description: "Get in touch with The Floral Collection. We'd love to hear from you." };

export default function ContactPage() {
    return (
        <>
            <SubpageHero image="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1600&h=700&fit=crop&q=80" overline="Get in Touch" title="Contact Us" subtitle="We'd love to hear from you. Reach out for packages, orders, or general inquiries." />
            <SubpageSection id="ct-info" overline="Contact" title="Contact Information" paragraphs={["Phone: (800) 123-4567", "Email: info@floralcollection.com", "Address: Oakland, California", "Office Hours: Monday – Friday, 9AM – 6PM PST"]} image="https://images.unsplash.com/photo-1508610048658-a5b83e33f995?w=800&h=600&fit=crop&q=80" imageAlt="Contact" />
            <SubpageSection id="ct-book" overline="Inquire" title="Request a Consultation" paragraphs={["Tell us which package interests you — Essential, Plus, Luxe, or Elite — and we'll get back to you with details and availability."]} image="https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=600&fit=crop&q=80" imageAlt="Consultation" cta={{ label: "Email Us", href: "mailto:info@floralcollection.com" }} reverse alt />
        </>
    );
}
