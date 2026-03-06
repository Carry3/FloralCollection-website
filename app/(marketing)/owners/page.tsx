import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import SubpageSection from "@/components/shared/SubpageSection";

export const metadata: Metadata = { title: "Owners", description: "Everything you need to manage and grow your investment portfolio." };

export default function OwnersPage() {
    return (
        <>
            <SubpageHero image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&h=700&fit=crop&q=80" overline="For Property Owners" title="Owner Resources" subtitle="Everything you need to manage and grow your investment portfolio." />
            <SubpageSection id="own-portal" overline="Portal" title="Owner Portal" paragraphs={["Access your real-time property data, financial reports, maintenance history, and tenant communications all in one centralized platform. Our owner portal is available 24/7 from any device.", "View statements, approve work orders, and track your portfolio performance — all without a single phone call."]} image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80" imageAlt="Owner Portal" />
            <SubpageSection id="own-why" overline="Why Us" title="Why Owners Choose Us" paragraphs={["From 24/7 smart sensors to AI-driven marketing, we combine cutting-edge technology with hands-on service. Our guarantees — eviction protection, rent guarantee, and satisfaction guarantee — mean your investment is always protected.", "We treat your property like our own. That's not a tagline — it's our operating principle."]} image="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop&q=80" imageAlt="Why Choose Us" reverse alt />
            <SubpageSection id="own-faq" overline="FAQs" title="Owner FAQs" paragraphs={["Have questions about our management services, fee structure, or onboarding process? We've compiled answers to the most common questions from property owners.", "Can't find what you're looking for? Contact us directly and we'll be happy to help."]} image="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop&q=80" imageAlt="FAQs" />
            <SubpageSection id="own-resources" overline="Resources" title="Owner Resources & Calculators" paragraphs={["Make informed decisions with our suite of investment tools: Rent vs. Sell Calculator, ROI Calculator, and Vacancy Loss Calculator. Each tool uses real market data to give you actionable insights.", "Plus access our Investor Guides and Market Insights for the latest trends in property investment."]} image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&q=80" imageAlt="Resources" reverse alt />
        </>
    );
}
