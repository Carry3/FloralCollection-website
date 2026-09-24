import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import SubpageSection from "@/components/shared/SubpageSection";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
    return (
        <>
            <SubpageHero image="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=700&fit=crop&q=80" title="Legal" compact />
            <SubpageSection id="leg-privacy" overline="Privacy" title="Privacy Policy" paragraphs={["Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information when you use our website and services.", "We are committed to maintaining the security and confidentiality of your data in compliance with all applicable laws and regulations."]} fullWidth />
        </>
    );
}
