import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import SubpageSection from "@/components/shared/SubpageSection";

export const metadata: Metadata = { title: "Technology", description: "The Floral Collection — technology that supports quality and delivery." };

export default function TechnologyPage() {
    return (
        <>
            <SubpageHero image="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1600&h=700&fit=crop&q=80" overline="Technology" title="Technology" subtitle="Systems that support quality, consistency, and delivery." />
            <SubpageSection id="tech-overview" overline="Overview" title="Our Technology" paragraphs={["The Floral Collection uses modern systems to manage sourcing, quality control, and delivery. From inventory and supply chain to scheduling and client communication, we rely on technology to maintain the high standards our clients expect."]} image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80" imageAlt="Technology" />
            <SubpageSection id="tech-platform" overline="Platform" title="Platform & Tools" paragraphs={["Our platform supports ordering, recurring schedules, and real-time updates. Clients can manage preferences, delivery details, and special requests in one place.", "Behind the scenes, we use data and automation to optimize freshness, reduce waste, and ensure every arrangement meets our standards."]} image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80" imageAlt="Platform" reverse alt />
        </>
    );
}
