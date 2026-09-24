import { Metadata } from "next";
import FaqAccordion from "@/components/faq/FaqAccordion";
import { FAQS } from "@/lib/faq";

export const metadata: Metadata = {
    title: "F.A.Q.",
    description: "Answers to common questions about The Floral Collection wedding packages, booking, deposits, and delivery, setup & removal.",
};

function FaqSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.text },
        })),
    };
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function FaqPage() {
    return (
        <section className="faq-page">
            <FaqSchema />
            <div className="faq-page-inner">
                <span className="package-detail-overline">F.A.Q.</span>
                <h1 className="faq-page-title">Frequently Asked Questions</h1>
                <span className="floral-divider" aria-hidden="true" />
                <FaqAccordion items={FAQS} />
            </div>
        </section>
    );
}
