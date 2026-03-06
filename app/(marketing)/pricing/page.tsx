import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import SubpageSection from "@/components/shared/SubpageSection";

export const metadata: Metadata = { title: "Pricing", description: "Simple, transparent pricing with no hidden fees." };

export default function PricingPage() {
    return (
        <>
            <SubpageHero image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&h=700&fit=crop&q=80" overline="Transparent Pricing" title="Pricing Plans" subtitle="Simple, transparent pricing with no hidden fees." />
            <SubpageSection overline="Our Plans" title="Management Packages" paragraphs={["We offer competitive, transparent pricing tiers designed to match your portfolio size and management needs. Every plan includes our core technology suite — 24/7 sensors, integrated reporting, and AI-driven marketing.", "Contact us for a customized quote tailored to your specific properties and requirements."]} image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&q=80" imageAlt="Pricing" cta={{ label: "Get a Quote", href: "/contact" }} />
        </>
    );
}
