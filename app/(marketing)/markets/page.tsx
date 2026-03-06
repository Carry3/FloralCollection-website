import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import SubpageSection from "@/components/shared/SubpageSection";

export const metadata: Metadata = { title: "Markets We Serve", description: "The Floral Collection — markets and areas we serve." };

export default function MarketsPage() {
    return (
        <>
            <SubpageHero image="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1600&h=700&fit=crop&q=80" overline="Markets" title="Markets We Serve" subtitle="Where we deliver The Floral Collection." />
            <SubpageSection id="markets-overview" overline="Overview" title="Markets We Serve" paragraphs={["The Floral Collection currently serves select markets with premium floral delivery and ongoing service. We focus on areas where we can maintain the quality and reliability our clients expect."]} image="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop&q=80" imageAlt="Markets" />
            <SubpageSection id="markets-areas" overline="Areas We Serve" title="Coverage & Expansion" paragraphs={["We serve the greater San Francisco Bay Area and Oakland, with plans for strategic expansion into additional regions. Our deep local knowledge helps us source the best seasonal blooms and deliver on time.", "Contact us to confirm availability in your area or to join the waitlist for new markets."]} image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&q=80" imageAlt="Areas" reverse alt />
        </>
    );
}
