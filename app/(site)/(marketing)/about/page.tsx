import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { TEAM } from "@/lib/team";

export const metadata: Metadata = {
    title: "About Us & Our Flowers",
    description: "The Floral Collection makes elegant wedding design more accessible, more affordable, and completely stress-free — with premium real-touch florals and full delivery, setup, and removal.",
};

export default function AboutPage() {
    return (
        <>
            <SubpageHero image="/images/about/setup-team.webp" title="About Us & Our Flowers" align="right" />

            <section className="about-block" id="abt-who">
                <ScrollReveal>
                    <div className="about-block-inner">
                        <h2 className="package-section-title">Who We Are</h2>
                        <span className="floral-divider" aria-hidden="true" />
                        <p>
                            At <strong>The Floral Collection</strong>, we believe every couple deserves a wedding that feels
                            beautiful, elegant, and unforgettable — without feeling impossible to afford.
                        </p>
                        <p>
                            Our company was inspired by my own personal experience. When planning my own wedding, I quickly
                            realized how expensive everything was. The flowers, décor, setup, rentals, and small details added
                            up so fast that it started to feel like the wedding of my dreams was out of reach. That experience
                            opened my eyes to the real problem that so many couples want a stunning wedding, but the prices
                            often make them feel forced to compromise on their vision.
                        </p>
                        <p>That is why <strong>The Floral Collection</strong> was created.</p>
                        <p>
                            We wanted to build a wedding décor company that gives couples the luxury look they dream of at a
                            price that actually makes sense. Our goal is simple: make elegant wedding design more accessible,
                            more affordable, and completely stress-free.
                        </p>
                        <p>
                            We specialize in curated wedding packages that include silk floral arrangements, centerpieces,
                            chuppahs and flower arches, ceremony décor, reception styling, candles, signage, flower walls,
                            champagne displays, sweetheart table decorations, and other beautiful details that bring your
                            wedding vision to life.
                        </p>
                        <p>
                            From your first design conversation to your wedding day, our team helps you choose the package
                            that fits your style, venue, and budget. Once your design is finalized, we take care of the
                            delivery, setup, and removal, so you can focus on enjoying your special day instead of worrying
                            about the details.
                        </p>
                        <p>
                            At The Floral Collection, we help couples create a polished, romantic wedding design without the
                            unnecessary stress or inflated costs.
                        </p>
                    </div>
                </ScrollReveal>
            </section>

            <section className="about-block about-block--alt" id="abt-flowers">
                <ScrollReveal>
                    <div className="about-block-inner">
                        <h2 className="package-section-title">About Our Flowers</h2>
                        <span className="floral-divider" aria-hidden="true" />
                        <p>
                            At The Floral Collection, we use premium, next-generation florals created with the newest
                            real-touch technology to achieve an exceptionally natural appearance. Unlike conventional faux
                            flowers, which can look stiff, shiny, or visibly artificial, our florals are designed with
                            realistic petal textures, lifelike shapes, soft finishes, natural color variation, and full,
                            dimensional construction.
                        </p>
                        <p>
                            Our goal is to give couples the look and impact of luxury wedding florals without the
                            overwhelming cost of fresh arrangements. Every piece is carefully selected and professionally
                            styled to create a polished, romantic, and high-end atmosphere for your wedding day.
                        </p>
                        <p>
                            From centerpieces and flower arches to chuppahs, aisle flowers, sweetheart-table décor, and
                            floral walls, our designs are made to look beautiful in person, photograph naturally, and elevate
                            the entire room. The result is a refined floral experience that offers the beauty of fresh
                            flowers with the consistency, fullness, and lasting quality of today&apos;s most advanced
                            premium faux florals.
                        </p>
                    </div>
                </ScrollReveal>
            </section>

            <section className="about-team" id="abt-team">
                <ScrollReveal>
                    <h2 className="package-section-title">Meet Our Team</h2>
                    <span className="floral-divider" aria-hidden="true" />
                </ScrollReveal>
                <ul className="about-team-grid">
                    {TEAM.map((member, i) => (
                        <li key={member.name}>
                            <ScrollReveal delay={(i % 3) * 0.1}>
                                <div className="about-team-member">
                                    <img src={member.photo} alt={member.name} width={356} height={356} loading="lazy" />
                                    <h3>{member.name}</h3>
                                    <p>{member.role}</p>
                                </div>
                            </ScrollReveal>
                        </li>
                    ))}
                </ul>
            </section>
        </>
    );
}
