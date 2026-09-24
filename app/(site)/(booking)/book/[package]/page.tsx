import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BookingFlow from "@/components/booking/BookingFlow";
import { getPackage } from "@/lib/packages";

export const metadata: Metadata = { title: "Book a Package" };

export default async function BookPackagePage({ params }: { params: Promise<{ package: string }> }) {
    const { package: packageId } = await params;
    const pkg = getPackage(packageId);
    if (!pkg) notFound();

    return (
        <section className="booking-section">
            <div className="booking-header">
                <p className="tracking-label">Booking</p>
                <h1>Reserve Your Date</h1>
            </div>
            <BookingFlow pkg={pkg} />
        </section>
    );
}
