"use client";
import { FormEvent, useEffect, useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SocialLinks from "@/components/shared/SocialLinks";
import { CONTACT } from "@/lib/site";

export default function ContactDark({
    sectionTitle = "Contact Us",
    fullPage = false,
}: {
    sectionTitle?: string;
    /** 独立联系页：占满一屏并为固定导航留出顶部空间 */
    fullPage?: boolean;
}) {
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    // 从套餐页「Inquire」进来时带 ?package=，随咨询一起发给店家
    const [pkg, setPkg] = useState("");
    useEffect(() => {
        setPkg(new URLSearchParams(window.location.search).get("package")?.slice(0, 80) ?? "");
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fields = Object.fromEntries(new FormData(form).entries());
        setStatus("sending");
        try {
            const res = await fetch("/api/inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...fields, package: pkg }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || "Could not send your message.");
            setStatus("sent");
            form.reset();
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : "Could not send your message.");
            setStatus("error");
        }
    };

    return (
        <section className={`contact-section${fullPage ? " contact-section--page" : ""}`} id="contact">
            {sectionTitle && <h2 className="contact-section-title">{sectionTitle}</h2>}
            <div className="contact-inner">
                <div className="contact-text">
                    <ScrollReveal>
                        <h2>Contact Us To Discuss Your Big Day</h2>
                    </ScrollReveal>
                    <ScrollReveal delay={0.1}>
                        <dl className="contact-info-list">
                            <div className="contact-info-list-item">
                                <dt>Email:</dt>
                                <dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd>
                            </div>
                            <div className="contact-info-list-item">
                                <dt>Phone:</dt>
                                <dd><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></dd>
                            </div>
                            <div className="contact-info-list-item">
                                <dt>Area:</dt>
                                <dd>{CONTACT.area}</dd>
                            </div>
                            <div className="contact-info-list-item">
                                <dt>Hours:</dt>
                                <dd>{CONTACT.hours}</dd>
                            </div>
                        </dl>
                        <SocialLinks />
                    </ScrollReveal>
                </div>
                <ScrollReveal delay={0.2}>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="contact-honeypot" />
                        {pkg && (
                            <p className="contact-package-chip">
                                Inquiring about: <strong>{pkg}</strong>
                                <button type="button" onClick={() => setPkg("")} aria-label="Remove package">×</button>
                            </p>
                        )}
                        <div className="form-row">
                            <div className="form-group"><label htmlFor="contact-first">First Name</label><input id="contact-first" name="firstName" type="text" placeholder="John" required /></div>
                            <div className="form-group"><label htmlFor="contact-last">Last Name</label><input id="contact-last" name="lastName" type="text" placeholder="Smith" required /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label htmlFor="contact-email">Email</label><input id="contact-email" name="email" type="email" placeholder="john@example.com" required /></div>
                            <div className="form-group"><label htmlFor="contact-phone">Phone</label><input id="contact-phone" name="phone" type="tel" placeholder="(555) 000-0000" /></div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact-message">Message</label>
                            <textarea id="contact-message" name="message" placeholder="Share your wedding vision with us and let us know which packages interest you most." />
                        </div>
                        <button type="submit" className="contact-submit" disabled={status === "sending"}>
                            {status === "sending" ? "Sending…" : "Send Message"}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                        {status === "sent" && <p className="contact-form-status" role="status">Thank you! We&apos;ll be in touch soon.</p>}
                        {status === "error" && (
                            <p className="contact-form-status is-error" role="alert">
                                {errorMsg} You can also email us at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
                            </p>
                        )}
                    </form>
                </ScrollReveal>
            </div>
        </section>
    );
}
