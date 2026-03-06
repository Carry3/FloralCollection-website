import ScrollReveal from "@/components/ui/ScrollReveal";

interface Props {
    id?: string;
    overline: string;
    title: string;
    paragraphs: string[];
    image?: string;
    imageAlt?: string;
    reverse?: boolean;
    alt?: boolean;
    fullWidth?: boolean;
    cta?: { label: string; href: string };
}

export default function SubpageSection({ id, overline, title, paragraphs, image, imageAlt, reverse, alt, fullWidth, cta }: Props) {
    return (
        <section className={`subpage-section ${alt ? "alt" : ""} ${fullWidth ? "full-width" : ""}`} id={id}>
            <div className={`subpage-section-inner ${reverse ? "reverse" : ""}`}>
                <ScrollReveal>
                    <div className="subpage-section-text">
                        <span className="overline">{overline}</span>
                        <h2 >{title}</h2>
                        {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                        {cta && (
                            <a href={cta.href} className="btn-text">
                                {cta.label}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </a>
                        )}
                    </div>
                </ScrollReveal>
                {image && (
                    <ScrollReveal delay={0.15}>
                        <div className="subpage-section-img">
                            <img src={image} alt={imageAlt || ""} />
                        </div>
                    </ScrollReveal>
                )}
            </div>
        </section>
    );
}
