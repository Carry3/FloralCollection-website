import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import SubpageSection from "@/components/shared/SubpageSection";

export const metadata: Metadata = { title: "Luxe Package", description: "The Floral Collection Luxe Package — luxury arrangements and white-glove service." };

export default function LuxePackagePage() {
    return (
        <>
            <SubpageHero image="https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=1600&h=700&fit=crop&q=80" overline="Packages" title="Luxe Package" subtitle="Luxury arrangements and white-glove service." />
            <SubpageSection id="luxe-overview" overline="Overview" title="Luxe Package" paragraphs={["The Luxe Package is for those who expect the finest. Rare and luxury stems, designer vessels, and a higher level of personalization define this tier.", "Ideal for events, executive spaces, and clients who value exclusivity and exceptional presentation."]} image="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop&q=80" imageAlt="Luxe" />
            <SubpageSection id="luxe-details" overline="Details" title="What&apos;s Included" paragraphs={["All Plus benefits.", "Rare and luxury stem selection.", "Designer vases and containers.", "White-glove delivery and placement.", "Dedicated account coordination."]} image="https://images.unsplash.com/photo-1508610048658-a5b83e33f995?w=800&h=600&fit=crop&q=80" imageAlt="Luxe details" reverse alt />
        </>
    );
}
