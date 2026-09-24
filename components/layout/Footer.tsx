"use client";
import { TransitionLink } from "@/components/ui/TransitionLink";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-bottom">
                    <span className="footer-copy">&copy; 2026 The Floral Collection. All rights reserved.</span>
                    <div className="footer-legal">
                        <TransitionLink href="/order">Order Status</TransitionLink>
                        <TransitionLink href="/legal/rental-agreement">Rental Agreement</TransitionLink>
                        <TransitionLink href="/legal/privacy">Privacy Policy</TransitionLink>
                        <TransitionLink href="/legal/terms">Terms of Service</TransitionLink>
                    </div>
                </div>
            </div>
        </footer>
    );
}
