import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SubpageHero from "@/components/shared/SubpageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import PhotoCarousel from "@/components/gallery/PhotoCarousel";
import { formatPrice, getPackage, getPackagePhotos } from "@/lib/packages";

/** 所有套餐页顶部共用同一张大图（客户文档指定） */
const HERO_IMAGE = "/images/hero/entrance.webp";

export function packageMetadata(id: string): Metadata {
    const pkg = getPackage(id);
    if (!pkg) return {};
    return {
        title: `${pkg.name} — Package ${pkg.number}`,
        description: `${pkg.desc} ${formatPrice(pkg.price)} — delivery, setup & removal included.`,
    };
}

export default function PackagePage({ id }: { id: string }) {
    const pkg = getPackage(id);
    if (!pkg) notFound();

    return (
        <>
            <SubpageHero image={HERO_IMAGE} title={pkg.name} />

            <section className="package-detail" id={`${pkg.id}-details`}>
                <ScrollReveal>
                    <header className="package-detail-head">
                        <span className="package-detail-overline">Package {pkg.numberWord}</span>
                        <h2 className="package-detail-title">{pkg.name}</h2>
                        <span className="floral-divider" aria-hidden="true" />
                        <p className="package-detail-desc">{pkg.desc}</p>
                        <p className="package-detail-price">{formatPrice(pkg.price)}</p>
                        <p className="package-detail-note">Delivery, Set Up &amp; Removal Included</p>
                    </header>
                </ScrollReveal>

                <ScrollReveal>
                    <div className="package-included">
                        <h3 className="package-section-title">What&apos;s Included</h3>
                        <span className="floral-divider" aria-hidden="true" />
                        <ul className={`package-included-list package-included-list--cols-${pkg.columns}`}>
                            {pkg.included.map((item) => (
                                <li key={item.title} className="package-included-item">
                                    <img src={`/images/icons/${item.icon}.webp`} alt="" width={56} height={56} loading="lazy" />
                                    <div>
                                        <h4>{item.title}</h4>
                                        <p>{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </ScrollReveal>

                <ScrollReveal>
                    <div className="package-gallery">
                        <h3 className="package-section-title">Gallery</h3>
                        <span className="floral-divider" aria-hidden="true" />
                        <PhotoCarousel photos={getPackagePhotos(pkg)} label={`${pkg.name} photos`} />
                    </div>
                </ScrollReveal>

                <div className="package-detail-actions">
                    <div className="package-detail-buttons">
                        <TransitionLink href={`/book/${pkg.id}`} className="package-inquire-btn">
                            Book Online
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </TransitionLink>
                        <TransitionLink href={`/contact?package=${encodeURIComponent(pkg.name)}`} className="package-inquire-btn package-inquire-btn--outline">
                            Inquire About Package {pkg.number}
                        </TransitionLink>
                    </div>
                    <p className="package-detail-fineprint">
                        Reserve online with a 50% nonrefundable deposit and a signed agreement — or send us an inquiry and we&apos;ll plan it together.
                    </p>
                </div>
            </section>
        </>
    );
}
