import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import SubpageSection from "@/components/shared/SubpageSection";

export const metadata: Metadata = { title: "About Us", description: "The Floral Collection — our story, team, technology, and the markets we serve." };

export default function AboutPage() {
    return (
        <>
            <SubpageHero image="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1600&h=700&fit=crop&q=80" overline="Our Company" title="About Us" subtitle="The Floral Collection — curated floral experiences from Essential to Elite." />
            <SubpageSection id="abt-story" overline="Our Story" title="About The Floral Collection" paragraphs={["The Floral Collection was founded to bring curated, high-quality floral arrangements and packages to homes and businesses. We combine careful sourcing with thoughtful design and reliable delivery.", "From our Essential to Elite tiers, we aim to offer something for every need — whether everyday elegance or bespoke luxury."]} image="https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=600&fit=crop&q=80" imageAlt="About" />
            <SubpageSection id="abt-team" overline="Our Team" title="Meet the Team" paragraphs={["Our team brings together expertise in floral design, sourcing, and client service. Every member is committed to quality, freshness, and your satisfaction."]} image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&q=80" imageAlt="Team" reverse alt />
            <SubpageSection id="abt-tech" overline="Technology" title="Technology & Systems" paragraphs={["We use modern systems for ordering, scheduling, and delivery so you get consistent quality and visibility. Our platform supports recurring orders and preferences."]} image="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop&q=80" imageAlt="Technology" />
            <SubpageSection id="abt-markets" overline="Markets" title="Markets We Serve" paragraphs={["We currently serve the greater San Francisco Bay Area and Oakland, with plans for strategic expansion. Our local focus helps us source the best seasonal blooms and deliver on time."]} image="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop&q=80" imageAlt="Markets" reverse alt />
            <SubpageSection id="abt-licensing" overline="Standards" title="Quality & Standards" paragraphs={["The Floral Collection is committed to quality control, sustainable practices where possible, and clear communication. We stand behind our freshness and delivery standards."]} image="https://images.unsplash.com/photo-1508610048658-a5b83e33f995?w=800&h=600&fit=crop&q=80" imageAlt="Standards" />
        </>
    );
}
