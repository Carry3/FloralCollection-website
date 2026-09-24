import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import SubpageSection from "@/components/shared/SubpageSection";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
    return (
        <>
            <SubpageHero image="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=700&fit=crop&q=80" title="Legal" compact />
            <SubpageSection id="leg-terms" overline="Terms" title="Terms of Service" paragraphs={["These terms govern your use of The Floral Collection website and services. By accessing our platform, you agree to these terms and conditions."]} fullWidth />
        </>
    );
}
