import { Metadata } from "next";
import SubpageHero from "@/components/shared/SubpageHero";
import ListingsSection from "@/components/shared/ListingsSection";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: "Listings", description: "Browse available rentals across our managed portfolio." };

export default function ListingsPage() {
    return (
        <>
            <SubpageHero image="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&h=700&fit=crop&q=80" overline="Available Properties" title="Listings" subtitle="Browse available rentals across our managed portfolio." />
            <ListingsSection />
        </>
    );
}
