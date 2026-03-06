import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import SubpageSection from "@/components/shared/SubpageSection";

export const metadata: Metadata = { title: "Plus Package", description: "The Floral Collection Plus Package — more variety and premium touches." };

export default function PlusPackagePage() {
    return (
        <>
            <SubpageHero image="https://images.unsplash.com/photo-1508610048658-a5b83e33f995?w=1600&h=700&fit=crop&q=80" overline="Packages" title="Plus Package" subtitle="More variety and premium touches." />
            <SubpageSection id="plus-overview" overline="Overview" title="Plus Package" paragraphs={["The Plus Package elevates your experience with a wider variety of blooms, premium stems, and enhanced presentation. Designed for clients who want a step up in selection and style.", "Includes everything in Essential, plus seasonal premium varieties and optional add-ons such as candles or decorative elements."]} image="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop&q=80" imageAlt="Plus" />
            <SubpageSection id="plus-details" overline="Details" title="What&apos;s Included" paragraphs={["All Essential benefits.", "Premium and seasonal varieties.", "Larger or more elaborate arrangements.", "Optional extras: candles, foliage upgrades, and custom notes."]} image="https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=600&fit=crop&q=80" imageAlt="Plus details" reverse alt />
        </>
    );
}
