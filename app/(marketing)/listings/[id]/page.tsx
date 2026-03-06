import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SubpageHero from "@/components/shared/SubpageHero";
import { RENTALS, getRentalById } from "@/lib/rentals";

// ─── Static params ────────────────────────────────────────────────────────────
export function generateStaticParams() {
    return RENTALS.map((r) => ({ id: String(r.id) }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const rental = getRentalById(Number(id));
    if (!rental) return { title: "Listing Not Found" };
    return {
        title: `${rental.name} — ${rental.address}`,
        description: rental.description,
    };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const rental = getRentalById(Number(id));
    if (!rental) notFound();

    const priceFormatted = rental.price.toLocaleString("en-US");
    const depositFormatted = rental.deposit.toLocaleString("en-US");

    return (
        <>
            <SubpageHero
                image={rental.images[0]}
                overline={`${rental.neighborhood} · ${rental.city}`}
                title={rental.name}
                subtitle={rental.address}
            />

            {/* ── Stats bar ─────────────────────────────────────────────────── */}
            <div className="listing-stats-bar">
                <div className="listing-stats-inner">
                    <div className="listing-stat">
                        <span className="listing-stat-value">${priceFormatted}</span>
                        <span className="listing-stat-label">per month</span>
                    </div>
                    <div className="listing-stat-divider" />
                    <div className="listing-stat">
                        <span className="listing-stat-value">{rental.beds}</span>
                        <span className="listing-stat-label">{rental.beds === 1 ? "Bedroom" : "Bedrooms"}</span>
                    </div>
                    <div className="listing-stat-divider" />
                    <div className="listing-stat">
                        <span className="listing-stat-value">{rental.baths}</span>
                        <span className="listing-stat-label">{rental.baths === 1 ? "Bathroom" : "Bathrooms"}</span>
                    </div>
                    <div className="listing-stat-divider" />
                    <div className="listing-stat">
                        <span className="listing-stat-value">{rental.sqft.toLocaleString()}</span>
                        <span className="listing-stat-label">sq ft</span>
                    </div>
                    <div className="listing-stat-divider" />
                    <div className="listing-stat">
                        <span className="listing-stat-value listing-stat-available">{rental.available}</span>
                        <span className="listing-stat-label">Availability</span>
                    </div>
                </div>
            </div>

            {/* ── Main content ──────────────────────────────────────────────── */}
            <section className="listing-detail-section">
                <div className="listing-detail-inner">

                    {/* Left column: description + amenities */}
                    <div className="listing-detail-main">

                        {/* About */}
                        <div className="listing-detail-block">
                            <span className="overline">About This Property</span>
                            <h2 className="listing-detail-heading">{rental.name}</h2>
                            <p className="listing-detail-description">{rental.description}</p>
                        </div>

                        {/* Tags */}
                        <div className="listing-detail-block">
                            <span className="overline">Highlights</span>
                            <div className="listing-tags">
                                {rental.tags.map((tag) => (
                                    <span key={tag} className="listing-tag">{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* Amenities */}
                        {rental.amenities.map((group) => (
                            <div key={group.category} className="listing-detail-block">
                                <span className="overline">{group.category}</span>
                                <ul className="listing-amenities">
                                    {group.items.map((item) => (
                                        <li key={item} className="listing-amenity-item">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Gallery */}
                        {rental.images.length > 1 && (
                            <div className="listing-detail-block">
                                <span className="overline">Gallery</span>
                                <div className="listing-gallery">
                                    {rental.images.map((src, i) => (
                                        <div key={i} className="listing-gallery-img">
                                            <Image src={src} alt={`${rental.name} — photo ${i + 1}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="listing-gallery-photo" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right column: facts + CTA */}
                    <aside className="listing-detail-aside">
                        <div className="listing-aside-card">
                            <div className="listing-aside-price">
                                <span>${priceFormatted}</span>
                                <span className="listing-aside-period">/mo</span>
                            </div>

                            <Link href="/contact" className="btn listing-aside-cta">
                                Schedule a Viewing
                            </Link>
                            <a href="tel:+1-310-000-0000" className="btn-outline listing-aside-tel">
                                Call Us
                            </a>

                            <div className="listing-aside-facts">
                                <div className="listing-aside-fact">
                                    <span className="listing-aside-fact-label">Type</span>
                                    <span className="listing-aside-fact-value">{rental.type}</span>
                                </div>
                                <div className="listing-aside-fact">
                                    <span className="listing-aside-fact-label">Floor</span>
                                    <span className="listing-aside-fact-value">{rental.floor}</span>
                                </div>
                                <div className="listing-aside-fact">
                                    <span className="listing-aside-fact-label">Security Deposit</span>
                                    <span className="listing-aside-fact-value">${depositFormatted}</span>
                                </div>
                                <div className="listing-aside-fact">
                                    <span className="listing-aside-fact-label">Lease Terms</span>
                                    <span className="listing-aside-fact-value">{rental.leaseTerms}</span>
                                </div>
                                <div className="listing-aside-fact">
                                    <span className="listing-aside-fact-label">Pets</span>
                                    <span className="listing-aside-fact-value">{rental.petPolicy}</span>
                                </div>
                                <div className="listing-aside-fact">
                                    <span className="listing-aside-fact-label">Parking</span>
                                    <span className="listing-aside-fact-value">{rental.parking}</span>
                                </div>
                            </div>
                        </div>

                        <Link href="/listings" className="listing-back-link">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                            Back to all listings
                        </Link>
                    </aside>

                </div>
            </section>
        </>
    );
}
