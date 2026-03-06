import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import SubpageSection from "@/components/shared/SubpageSection";
import ServicesHashScroll from "@/components/services/ServicesHashScroll";
import ServicesIntro from "@/components/services/ServicesIntro";
import ServicesResidentialScroll from "@/components/services/ServicesResidentialScroll";
import ServicesGuaranteesSpiral from "@/components/services/ServicesGuaranteesSpiral";
import ServicesFreeAnalysis from "@/components/services/ServicesFreeAnalysis";
import { SERVICE_SCREENS } from "@/lib/services-content";

export const metadata: Metadata = {
    title: "Packages | The Floral Collection",
    description: "Essential, Plus, Luxe, and Elite packages from The Floral Collection.",
    openGraph: {
        title: "Packages | The Floral Collection",
        description: "Essential, Plus, Luxe, and Elite packages from The Floral Collection.",
        type: "website",
    },
    robots: "index, follow",
};

function ServicesSchema() {
    const breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://floralcollection.com/" },
            { "@type": "ListItem", position: 2, name: "Services", item: "https://floralcollection.com/services" },
        ],
    };
    const services = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: SERVICE_SCREENS.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
                "@type": "Service",
                name: s.title,
                description: s.description,
                provider: { "@type": "Organization", name: "The Floral Collection" },
            },
        })),
    };
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(services) }} />
        </>
    );
}

export default function ServicesPage() {
    return (
        <>
            <ServicesSchema />
            <SubpageHero image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&h=700&fit=crop&q=80" overline="What We Do" title="Our Services" subtitle="Comprehensive property management powered by technology, driven by care." />
            <ServicesHashScroll />
            <section id="residential" aria-labelledby="services-intro-heading">
                <ServicesIntro />
                <ServicesResidentialScroll />
            </section>
            <SubpageSection id="multifamily" overline="Multifamily" title="Multifamily Property Management" paragraphs={["Specialized management for apartment complexes and multi-unit buildings. We optimize occupancy rates, streamline operations, and implement building-wide sensor systems that reduce costs.", "Our 24/7 monitoring and monthly inspections ensure every unit is protected, while integrated reporting gives you portfolio-wide visibility."]} image="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&q=80" imageAlt="Multifamily" reverse alt />
            <SubpageSection id="commercial" overline="Commercial" title="Commercial Property Management" paragraphs={["Office spaces, retail locations, and mixed-use developments require a different management approach. We bring institutional-grade processes to commercial portfolios of all sizes.", "From lease administration to capital improvement planning, our team handles the complexities of commercial management with precision."]} image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&q=80" imageAlt="Commercial" />
            <ServicesGuaranteesSpiral />
            <ServicesFreeAnalysis />
        </>
    );
}
