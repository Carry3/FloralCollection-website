"use client";
import { FormEvent, useEffect, useRef } from "react";
import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ContactDark() {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        alert("Thank you! We will be in touch soon.");
    };

    const sectionRef = useRef<HTMLElement | null>(null);
    const leftImgRef = useRef<HTMLImageElement | null>(null);
    const rightImgRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const handleParallax = () => {
            const rect = section.getBoundingClientRect();
            const viewH = window.innerHeight;
            if (rect.top >= viewH || rect.bottom <= 0) return;

            const centerY = rect.top + rect.height / 2;
            const triggerStart = viewH * 0.7;
            const triggerEnd = viewH * 0.2;

            const rawProgress = (triggerStart - centerY) / (triggerStart - triggerEnd);
            const progress = Math.max(0, Math.min(1, rawProgress));

            // Move left image UP by up to 30px (progress 0 -> 1 means delta 0 -> 30)
            // Move right image DOWN by up to 30px
            const maxOffset = viewH * 0.05;
            const delta = progress * maxOffset;

            if (leftImgRef.current) leftImgRef.current.style.transform = `translateY(${-delta}px)`;
            if (rightImgRef.current) rightImgRef.current.style.transform = `translateY(${delta}px)`;
        };

        handleParallax();
        window.addEventListener("scroll", handleParallax, { passive: true });
        window.addEventListener("resize", handleParallax);
        return () => {
            window.removeEventListener("scroll", handleParallax);
            window.removeEventListener("resize", handleParallax);
        };
    }, []);

    return (
        <section className="contact-section" id="contact" ref={sectionRef}>
            <div className="contact-deco contact-deco-left">
                <Image
                    ref={leftImgRef}
                    src="https://cdn.prod.website-files.com/683b2c2507268b0778db41c8/683fdce8462ff6375db9664c_img_left_cta.avif"
                    width={828}
                    height={1104}
                    sizes="22.5rem"
                    loading="lazy"
                    alt=""
                    style={{ height: "auto" }}
                />
            </div>
            <div className="contact-deco contact-deco-right">
                <Image
                    ref={rightImgRef}
                    src="https://cdn.prod.website-files.com/683b2c2507268b0778db41c8/683fdc4362c3f1c05c4f8359_img_right_cta.avif"
                    width={828}
                    height={1104}
                    loading="lazy"
                    alt=""
                    style={{ height: "auto" }}
                />
            </div>

            <div className="contact-inner">
                <div className="contact-text">
                    <ScrollReveal>
                        <span className="overline">Get in Touch</span>
                        <h2>Get in Touch with The Floral Collection</h2>
                        <p>Ready to learn more? Contact us for a consultation and to explore our Essential, Plus, Luxe, and Elite packages.</p>
                    </ScrollReveal>
                    <ScrollReveal delay={0.1}>
                        <div className="contact-info-list">
                            <div className="contact-info-item"><span className="contact-info-icon">Email</span><span>info@floralcollection.com</span></div>
                            <div className="contact-info-item"><span className="contact-info-icon">Phone</span><span>(800) 123-4567</span></div>
                            <div className="contact-info-item"><span className="contact-info-icon">Address</span><span>Oakland, California</span></div>
                            <div className="contact-info-item"><span className="contact-info-icon">Hours</span><span>Mon–Fri 9AM–6PM PST</span></div>
                        </div>
                    </ScrollReveal>
                </div>
                <ScrollReveal delay={0.2}>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group"><label>First Name</label><input type="text" placeholder="John" /></div>
                            <div className="form-group"><label>Last Name</label><input type="text" placeholder="Smith" /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Email</label><input type="email" placeholder="john@example.com" /></div>
                            <div className="form-group"><label>Phone</label><input type="tel" placeholder="(555) 000-0000" /></div>
                        </div>
                        <div className="form-group">
                            <label>Interest</label>
                            <select defaultValue=""><option value="" disabled>Select</option><option>Essential Package</option><option>Plus Package</option><option>Luxe Package</option><option>Elite Package</option><option>General inquiry</option></select>
                        </div>
                        <div className="form-group"><label>Message</label><textarea placeholder="Tell us how we can help..." /></div>
                        <button type="submit" className="btn-primary">
                            Send Message
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                    </form>
                </ScrollReveal>
            </div>
        </section>
    );
}
