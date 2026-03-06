"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ListingsMap from "./ListingsMap";
import { RENTALS } from "@/lib/rentals";

export default function ListingsSection() {
    const [activeId, setActiveId] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const handleCardClick = (rentalId: number) => {
        // Read current expandedId from closure directly — avoid setState-in-updater anti-pattern
        const isCollapsing = expandedId === rentalId;
        const next = isCollapsing ? null : rentalId;
        setExpandedId(next);
        setActiveId(next);  // React 18 batches these into a single re-render
    };

    const handleMarkerClick = (rentalId: number) => {
        setActiveId(rentalId);
        setExpandedId(rentalId);
    };

    // Scroll after the expansion animation finishes (350ms CSS transition)
    useEffect(() => {
        if (expandedId == null) return;
        const id = expandedId;
        const timeout = setTimeout(() => {
            const container = listRef.current;
            const card = document.getElementById(`rental-card-${id}`);
            if (!container || !card) return;

            const containerTop = container.getBoundingClientRect().top;
            const cardTop = card.getBoundingClientRect().top;
            const offset =
                container.scrollTop +
                (cardTop - containerTop) -
                container.clientHeight / 2 +
                card.clientHeight / 2;

            container.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
        }, 430); // wait for 400ms max-height transition + small buffer

        return () => clearTimeout(timeout);
    }, [expandedId]);

    return (
        <section className="listings-section">
            {/* ── Left: rental list ─────────────────────────────────── */}
            <div className="listings-list-col">
                <div className="listings-list-header">
                    <span className="overline">Browse</span>
                    <h2>Available Rentals</h2>
                    <p className="listings-count">{RENTALS.length} properties found</p>
                </div>
                <div className="listings-list" ref={listRef}>
                    {RENTALS.map((rental) => {
                        const isActive = activeId === rental.id;
                        const isExpanded = expandedId === rental.id;
                        return (
                            <div
                                key={rental.id}
                                id={`rental-card-${rental.id}`}
                                className={`rental-card ${isActive ? "active" : ""} ${isExpanded ? "expanded" : ""}`}
                                onClick={() => handleCardClick(rental.id)}
                            >
                                <div className="rental-card-img">
                                    <img src={rental.image} alt={rental.address} />
                                    <span className="rental-available">{rental.available}</span>
                                </div>
                                <div className="rental-card-body">
                                    <div className="rental-card-summary">
                                        <div className="rental-card-top">
                                            <div className="rental-card-info">
                                                <h3 className="rental-name">{rental.name}</h3>
                                                <p className="rental-address">{rental.address}</p>
                                                <p className="rental-neighborhood">{rental.neighborhood}</p>
                                            </div>
                                            <div className="rental-card-header-right">
                                                <div className="rental-price">
                                                    <span className="price-amount">${rental.price.toLocaleString()}</span>
                                                    <span className="price-unit">/mo</span>
                                                </div>
                                                <span className="rental-card-chevron" aria-hidden>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                        <path d="M6 9l6 6 6-6" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="rental-specs">
                                            <span>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20v-6a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v6" /><path d="M12 10V4" /></svg>
                                                {rental.beds} bd
                                            </span>
                                            <span>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h16" /><path d="M4 12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8H4v4z" /><path d="M2 8h20" /></svg>
                                                {rental.baths} ba
                                            </span>
                                            <span>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
                                                {rental.sqft.toLocaleString()} sqft
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`rental-card-detail ${isExpanded ? "is-open" : ""}`}>
                                        {rental.description && (
                                            <p className="rental-description">{rental.description}</p>
                                        )}
                                        <div className="rental-tags">
                                            {rental.tags.map((tag) => (
                                                <span key={tag} className="rental-tag">{tag}</span>
                                            ))}
                                        </div>
                                        <div className="rental-cta-row" onClick={(e) => e.stopPropagation()}>
                                            <Link href={`/listings/${rental.id}`} className="rental-cta">
                                                View Details
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                            </Link>
                                            <Link href="/contact" className="rental-cta rental-cta-outline">
                                                Schedule Viewing
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Right: map card ───────────────────────────────────── */}
            <div className="listings-map-col">
                <div className="listings-map-card">
                    <div className="listings-map-inner">
                        <ListingsMap
                            rentals={RENTALS}
                            activeId={activeId}
                            onMarkerClick={handleMarkerClick}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
