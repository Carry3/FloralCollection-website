import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import SubpageSection from "@/components/shared/SubpageSection";

export const metadata: Metadata = { title: "Tenants", description: "Your home, your comfort — we're here to make renting effortless." };

export default function TenantsPage() {
    return (
        <>
            <SubpageHero image="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&h=700&fit=crop&q=80" overline="For Tenants" title="Tenant Resources" subtitle="Your home, your comfort — we're here to make renting effortless." />
            <SubpageSection id="ten-portal" overline="Portal" title="Tenant Portal" paragraphs={["Pay rent, submit maintenance requests, and communicate with your property management team through our secure tenant portal. Available 24/7 from any device."]} image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80" imageAlt="Tenant Portal" />
            <SubpageSection id="ten-apply" overline="Apply" title="Apply for a Rental" paragraphs={["Browse our available listings and submit your application online. Our streamlined process makes it easy to find and secure your next home."]} image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&q=80" imageAlt="Apply" reverse alt />
            <SubpageSection id="ten-maintenance" overline="Maintenance" title="Maintenance Requests" paragraphs={["Need something fixed? Submit a maintenance request through our portal and track its progress in real-time. Our 24/7 maintenance oversight ensures issues are resolved quickly."]} image="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop&q=80" imageAlt="Maintenance" />
            <SubpageSection id="ten-faq" overline="FAQs" title="Tenant FAQs" paragraphs={["Answers to common questions about lease agreements, rent payments, maintenance procedures, move-in/move-out processes, and more."]} image="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop&q=80" imageAlt="FAQs" reverse alt />
            <SubpageSection id="ten-resources" overline="Resources" title="Tenant Resources" paragraphs={["Helpful guides, community information, and important documents for current tenants. Everything you need for a smooth rental experience."]} image="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&q=80" imageAlt="Resources" />
        </>
    );
}
