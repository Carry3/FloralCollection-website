import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import GalleryExplorer from "@/components/gallery/GalleryExplorer";

export const metadata: Metadata = {
    title: "Our Gallery",
    description: "Browse wedding floral designs by package — Classic, Signature, Luxe, and Grand Collections from The Floral Collection.",
};

export default function GalleryPage() {
    return (
        <>
            <SubpageHero image="/images/hero/entrance.webp" title="Our Gallery" />

            <section className="gallery-intro">
                <ScrollReveal>
                    <header className="gallery-intro-head">
                        <h2 className="package-section-title">Browse by Package</h2>
                        <span className="floral-divider" aria-hidden="true" />
                        <p>Select a package to view its photos.</p>
                    </header>
                </ScrollReveal>
                <GalleryExplorer />
            </section>
        </>
    );
}
