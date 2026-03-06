import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import SubpageSection from "@/components/shared/SubpageSection";

export const metadata: Metadata = { title: "Elite Package", description: "The Floral Collection Elite Package — the ultimate in bespoke floral experiences." };

export default function ElitePackagePage() {
    return (
        <>
            <SubpageHero image="https://images.unsplash.com/photo-1508610048658-a5b83e33f995?w=1600&h=700&fit=crop&q=80" overline="Packages" title="Elite Package" subtitle="The ultimate in bespoke floral experiences." />
            <SubpageSection id="elite-overview" overline="Overview" title="Elite Package" paragraphs={["The Elite Package is our highest tier: fully bespoke designs, rare and imported varieties, and a dedicated floral designer for your account.", "Tailored to high-profile events, flagship locations, and clients who want an unmatched level of service and creativity."]} image="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop&q=80" imageAlt="Elite" />
            <SubpageSection id="elite-details" overline="Details" title="What&apos;s Included" paragraphs={["All Luxe benefits.", "Fully bespoke designs and consultations.", "Rare and imported flowers.", "Dedicated floral designer.", "Priority scheduling and same-day options where available."]} image="https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=600&fit=crop&q=80" imageAlt="Elite details" reverse alt />
        </>
    );
}
