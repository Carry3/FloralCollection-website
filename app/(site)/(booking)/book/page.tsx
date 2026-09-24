import type { Metadata } from "next";
import BookIndex from "@/components/booking/BookIndex";

export const metadata: Metadata = { title: "Book a Package" };

export default function BookPage() {
    return (
        <section className="booking-section">
            <div className="booking-header">
                <p className="tracking-label">Booking</p>
                <h1>Choose Your Package</h1>
                <p className="booking-header-sub">
                    Reserve your date online with a 50% nonrefundable deposit and a signed rental agreement.
                    The balance is due before your wedding — pay it any time with your order number.
                </p>
            </div>
            <BookIndex />
        </section>
    );
}
