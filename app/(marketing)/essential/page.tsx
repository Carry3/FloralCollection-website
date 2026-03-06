import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import SubpageSection from "@/components/shared/SubpageSection";

export const metadata: Metadata = { title: "Essential Package", description: "The Floral Collection Essential Package — a curated selection for everyday elegance." };

export default function EssentialPackagePage() {
    return (
        <>
            <SubpageHero image="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1600&h=700&fit=crop&q=80" overline="Packages" title="Essential Package" subtitle="A curated selection for everyday elegance." />
            <SubpageSection id="essential-overview" overline="Overview" title="Essential Package" paragraphs={["The Essential Package from The Floral Collection brings refined, classic arrangements suited for homes and offices. Thoughtfully selected blooms and greenery delivered with care.", "Ideal for those who appreciate understated beauty and consistent quality. Perfect for recurring deliveries or one-time occasions."]} image="https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=600&fit=crop&q=80" imageAlt="Essential" />
            <SubpageSection id="essential-details" overline="Details" title="What&apos;s Included" paragraphs={["Seasonal fresh flowers and foliage.", "Elegant vase or container.", "Care instructions and delivery to your door.", "Flexible scheduling to suit your needs."]} image="https://images.unsplash.com/photo-1508610048658-a5b83e33f995?w=800&h=600&fit=crop&q=80" imageAlt="Essential details" reverse alt />
        </>
    );
}
