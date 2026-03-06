"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ServicesFreeAnalysis() {
    return (
        <section
            id="free-analysis"
            className="services-free-analysis"
            aria-labelledby="free-analysis-heading"
        >
            <div className="services-free-analysis-inner">
                <ScrollReveal delay={0}>
                    <div className="services-free-analysis-text">
                        <h2 id="free-analysis-heading">Get Your Free Rental Analysis</h2>
                        <p>
                            Market comparison, rental estimate, and vacancy risk assessment — no obligation, complimentary. We use local market data and comparable properties to give you an accurate picture of what your property could earn.
                        </p>
                        <Link href="/contact#book" className="btn-primary services-free-analysis-cta">
                            Request Your Analysis
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </Link>
                    </div>
                </ScrollReveal>
                <ScrollReveal delay={0.15}>
                    <div className="services-free-analysis-form-wrap">
                        <form className="services-free-analysis-form" onSubmit={(e) => e.preventDefault()} aria-label="Free rental analysis request">
                            <label className="services-free-analysis-label">
                                Property Address <span className="required">*</span>
                                <input type="text" name="address" required className="services-free-analysis-input" placeholder="Street, city, state" />
                            </label>
                            <label className="services-free-analysis-label">
                                Property Type <span className="required">*</span>
                                <select name="type" required className="services-free-analysis-input">
                                    <option value="">Select type</option>
                                    <option value="SF">Single Family</option>
                                    <option value="MF">Multifamily</option>
                                    <option value="Commercial">Commercial</option>
                                </select>
                            </label>
                            <label className="services-free-analysis-label">
                                Full Name <span className="required">*</span>
                                <input type="text" name="name" required className="services-free-analysis-input" />
                            </label>
                            <label className="services-free-analysis-label">
                                Email <span className="required">*</span>
                                <input type="email" name="email" required className="services-free-analysis-input" />
                            </label>
                            <label className="services-free-analysis-label">
                                Phone
                                <input type="tel" name="phone" className="services-free-analysis-input" />
                            </label>
                            <label className="services-free-analysis-label">
                                Notes
                                <textarea name="notes" rows={3} className="services-free-analysis-input services-free-analysis-textarea" placeholder="Optional" />
                            </label>
                            <button type="submit" className="btn-primary services-free-analysis-submit">
                                Request Your Analysis
                            </button>
                        </form>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
