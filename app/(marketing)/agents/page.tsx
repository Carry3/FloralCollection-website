import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import SubpageSection from "@/components/shared/SubpageSection";

export const metadata: Metadata = { title: "Agents", description: "Earn referral commissions while providing your clients with premium management." };

export default function AgentsPage() {
    return (
        <>
            <SubpageHero image="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1600&h=700&fit=crop&q=80" overline="Partner With Us" title="Agent Program" subtitle="Earn referral commissions while providing your clients with premium management." />
            <SubpageSection id="agt-referral" overline="Referral Program" title="Agent Referral Program" paragraphs={["Our agent referral program rewards real estate professionals who connect property owners with our management services. Earn competitive commissions while ensuring your clients receive the best care.", "We provide marketing materials, co-branded presentations, and dedicated partner support to help you succeed."]} image="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=600&fit=crop&q=80" imageAlt="Referral" />
            <SubpageSection id="agt-commission" overline="Commission" title="Commission Structure" paragraphs={["We offer a transparent commission structure for agent referrals. Earn a percentage of management fees for the duration of the management contract — not just a one-time referral bonus.", "Contact us for full commission details and partnership terms."]} image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&q=80" imageAlt="Commission" reverse alt />
            <SubpageSection id="agt-submit" overline="Submit" title="Submit a Referral" paragraphs={["Ready to refer a client? Submit their information through our secure referral form and we'll take it from there. You'll receive updates at every stage of the process."]} image="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=600&fit=crop&q=80" imageAlt="Submit" cta={{ label: "Submit Referral", href: "/contact" }} />
        </>
    );
}
