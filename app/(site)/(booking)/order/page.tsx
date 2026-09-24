import type { Metadata } from "next";
import OrderLookup from "@/components/orders/OrderLookup";

export const metadata: Metadata = {
    title: "Order Status",
    description: "Check the status of your Floral Collection booking with your order number and email.",
    robots: { index: false },
};

export default function OrderPage() {
    return (
        <section className="booking-section order-section">
            <OrderLookup />
        </section>
    );
}
