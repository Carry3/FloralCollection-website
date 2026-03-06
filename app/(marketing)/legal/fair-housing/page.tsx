import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import SubpageSection from "@/components/shared/SubpageSection";

export const metadata: Metadata = { title: "Fair Housing" };

export default function FairHousingPage() {
    return (
        <>
            <SubpageHero image="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=700&fit=crop&q=80" title="Legal" compact />
            <SubpageSection id="leg-housing" overline="Fair Housing" title="Fair Housing Statement" paragraphs={["The Floral Collection is committed to compliance with all applicable federal, state, and local laws. We do not discriminate on the basis of race, color, religion, sex, national origin, disability, familial status, or any other protected class."]} fullWidth />
        </>
    );
}
