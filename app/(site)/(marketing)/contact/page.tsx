import { Metadata } from "next";
import ContactDark from "@/components/homepage/ContactDark";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Contact The Floral Collection to discuss your big day. Serving South Florida — call +1 (954) 218-4569 or email Contact@thefloralcollections.com.",
};

export default function ContactPage() {
    return <ContactDark fullPage />;
}
