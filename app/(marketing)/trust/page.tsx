import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import SubpageSection from "@/components/shared/SubpageSection";

export const metadata: Metadata = { title: "Trust", description: "Real results from real property owners." };

export default function TrustPage() {
    return (
        <>
            <SubpageHero image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&h=700&fit=crop&q=80" overline="Trust & Proof" title="Why Clients Trust Us" subtitle="Real results from real property owners." />
            <SubpageSection id="tr-reviews" overline="Reviews" title="Reviews & Testimonials" paragraphs={["Don't just take our word for it. Hear from clients who've experienced The Floral Collection — from our responsive communication to our quality and delivery."]} image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&q=80" imageAlt="Reviews" />
            <SubpageSection id="tr-cases" overline="Case Studies" title="Case Studies" paragraphs={["Detailed case studies showing how we've helped property owners increase returns, reduce vacancy, and protect their investments with our management approach."]} image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80" imageAlt="Cases" reverse alt />
            <SubpageSection id="tr-guarantees" overline="Guarantees" title="Our Guarantees" paragraphs={["Eviction protection, rent guarantee, satisfaction guarantee, and property damage protection — all included with our management services. We put our money where our mouth is."]} image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop&q=80" imageAlt="Guarantees" />
        </>
    );
}
