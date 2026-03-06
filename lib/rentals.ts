// ─── Shared rental data ───────────────────────────────────────────────────────
// Used by both the Listings browse page and individual detail pages.

export type Rental = {
    id: number;
    name: string;
    address: string;
    neighborhood: string;
    city: string;
    // Summary (shown in the list card)
    description: string;
    price: number;
    deposit: number;
    beds: number;
    baths: number;
    sqft: number;
    type: string;
    floor: number;
    available: string;
    leaseTerms: string;
    petPolicy: string;
    parking: string;
    // Images
    image: string;         // primary thumbnail
    images: string[];      // gallery (includes primary)
    // Map
    lat: number;
    lng: number;
    // Metadata chips
    tags: string[];
    // Amenities for the detail page
    amenities: AmenityGroup[];
};

export type AmenityGroup = {
    category: string;
    items: string[];
};

export const RENTALS: Rental[] = [
    {
        id: 1,
        name: "Wilshire Vista",
        address: "1842 Wilshire Blvd, Unit 401",
        neighborhood: "Santa Monica",
        city: "Los Angeles",
        description: "Spacious two-bedroom with modern finishes, walking distance to shops and dining.",
        price: 3850,
        deposit: 5775,
        beds: 2,
        baths: 2,
        sqft: 1120,
        type: "Apartment",
        floor: 4,
        available: "Available Now",
        leaseTerms: "12-month minimum",
        petPolicy: "Cats & small dogs allowed with deposit",
        parking: "1 assigned underground space included",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=560&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop&q=80",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=560&fit=crop&q=80",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=560&fit=crop&q=80",
        ],
        lat: 34.0259,
        lng: -118.4965,
        tags: ["Parking", "Laundry", "Gym"],
        amenities: [
            { category: "Building", items: ["Rooftop deck", "Fitness center", "In-building laundry", "Package lockers", "24-hour concierge"] },
            { category: "Unit", items: ["Central AC & heat", "Hardwood floors", "Quartz countertops", "Stainless appliances", "Walk-in closet", "In-unit washer/dryer"] },
            { category: "Location", items: ["Walk Score 95", "Steps to 3rd Street Promenade", "1 block to Metro Expo Line", "Near Trader Joe's & Whole Foods"] },
        ],
    },
    {
        id: 2,
        name: "Ocean View Loft",
        address: "720 Ocean Ave, Unit 12B",
        neighborhood: "Venice",
        city: "Los Angeles",
        description: "Stunning ocean views from a bright third-floor loft with private balcony.",
        price: 4400,
        deposit: 6600,
        beds: 3,
        baths: 2,
        sqft: 1450,
        type: "Loft",
        floor: 12,
        available: "Available Mar 1",
        leaseTerms: "12–24 months",
        petPolicy: "No pets",
        parking: "2 assigned garage spaces",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=560&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop&q=80",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=560&fit=crop&q=80",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=560&fit=crop&q=80",
        ],
        lat: 33.9850,
        lng: -118.4695,
        tags: ["Ocean View", "Balcony", "AC"],
        amenities: [
            { category: "Building", items: ["Ocean-view rooftop lounge", "Heated pool & spa", "Secure bike storage", "EV charging stations", "Controlled access"] },
            { category: "Unit", items: ["Floor-to-ceiling windows", "Private balcony", "Chef's kitchen", "Soaking tub", "Smart home system", "In-unit washer/dryer"] },
            { category: "Location", items: ["Steps to Venice Beach", "Walk Score 88", "Near Abbot Kinney Blvd", "Easy freeway access"] },
        ],
    },
    {
        id: 3,
        name: "Highland Family Home",
        address: "3310 Highland Ave",
        neighborhood: "Manhattan Beach",
        city: "Los Angeles",
        description: "Single-family style living with yard and garage, ideal for families.",
        price: 5200,
        deposit: 7800,
        beds: 3,
        baths: 3,
        sqft: 1800,
        type: "Townhome",
        floor: 1,
        available: "Available Now",
        leaseTerms: "12-month minimum",
        petPolicy: "Dogs & cats welcome",
        parking: "2-car attached garage",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=560&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop&q=80",
            "https://images.unsplash.com/photo-1567767292278-a29a17a7d4ef?w=800&h=560&fit=crop&q=80",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=560&fit=crop&q=80",
        ],
        lat: 33.8847,
        lng: -118.4109,
        tags: ["Garage", "Yard", "Pet Friendly"],
        amenities: [
            { category: "Property", items: ["Private fenced yard", "2-car garage", "Storage room", "BBQ area", "Drought-tolerant landscaping"] },
            { category: "Interior", items: ["Open-plan kitchen/living", "Primary suite with spa bath", "Home office nook", "In-unit laundry room", "Tile & hardwood floors"] },
            { category: "Location", items: ["Top-rated school district", "0.5 mi to Manhattan Beach", "Walk Score 72", "Quiet residential street"] },
        ],
    },
    {
        id: 4,
        name: "Abbot Kinney Studio",
        address: "614 Abbot Kinney Blvd, Unit 5",
        neighborhood: "Venice",
        city: "Los Angeles",
        description: "Modern furnished studio steps from Abbot Kinney, rooftop access included.",
        price: 3100,
        deposit: 4650,
        beds: 1,
        baths: 1,
        sqft: 680,
        type: "Studio",
        floor: 2,
        available: "Available Mar 15",
        leaseTerms: "6–12 months",
        petPolicy: "No pets",
        parking: "Street parking / permit",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=560&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=560&fit=crop&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=560&fit=crop&q=80",
        ],
        lat: 33.9901,
        lng: -118.4651,
        tags: ["Modern", "Furnished", "Rooftop"],
        amenities: [
            { category: "Building", items: ["Furnished common areas", "Rooftop terrace with BBQ", "Secure entry", "Bike storage", "On-site management"] },
            { category: "Unit", items: ["Fully furnished", "Designer kitchen", "Smart TV & high-speed WiFi", "AC & heating", "Blackout blinds"] },
            { category: "Location", items: ["Steps to Abbot Kinney restaurants", "Walk Score 97", "Near Venice Canals", "Short bike ride to beach"] },
        ],
    },
    {
        id: 5,
        name: "Sepulveda Gardens",
        address: "4488 Sepulveda Blvd, Unit 302",
        neighborhood: "Culver City",
        city: "Los Angeles",
        description: "Quiet building with pool and EV charging; easy freeway access.",
        price: 2800,
        deposit: 4200,
        beds: 2,
        baths: 1,
        sqft: 950,
        type: "Apartment",
        floor: 3,
        available: "Available Now",
        leaseTerms: "12-month minimum",
        petPolicy: "Cats allowed with deposit",
        parking: "1 covered space included",
        image: "https://images.unsplash.com/photo-1567767292278-a29a17a7d4ef?w=800&h=560&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1567767292278-a29a17a7d4ef?w=1200&h=800&fit=crop&q=80",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=560&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=560&fit=crop&q=80",
        ],
        lat: 34.0057,
        lng: -118.4341,
        tags: ["Pool", "EV Charging", "Storage"],
        amenities: [
            { category: "Building", items: ["Heated pool & sundeck", "EV charging (2 stations)", "Storage units available", "Gated parking", "On-site laundry"] },
            { category: "Unit", items: ["Updated kitchen", "Carpeted bedrooms / tile common areas", "Large closets", "Private balcony", "Central heating"] },
            { category: "Location", items: ["Close to Culver City Studios", "Walk Score 79", "Metro E Line nearby", "Quick I-405 access"] },
        ],
    },
    {
        id: 6,
        name: "Strand Beach House",
        address: "209 Strand St, Unit 8",
        neighborhood: "Hermosa Beach",
        city: "Los Angeles",
        description: "Steps to the sand with deck and beach access; parking included.",
        price: 4750,
        deposit: 7125,
        beds: 2,
        baths: 2,
        sqft: 1100,
        type: "Apartment",
        floor: 1,
        available: "Available Apr 1",
        leaseTerms: "12-month minimum",
        petPolicy: "Case-by-case basis",
        parking: "1 assigned space + guest permits",
        image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=560&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=560&fit=crop&q=80",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=560&fit=crop&q=80",
        ],
        lat: 33.8622,
        lng: -118.4009,
        tags: ["Beach Access", "Deck", "Parking"],
        amenities: [
            { category: "Property", items: ["Private deck with ocean breeze", "Direct Strand path access", "Outdoor shower", "Bike storage"] },
            { category: "Interior", items: ["Open living/dining", "Updated kitchen with island", "Primary with en-suite bath", "In-unit laundry", "AC & heating"] },
            { category: "Location", items: ["Steps to the Strand", "Walk Score 91", "Hermosa Beach Pier nearby", "Excellent surf access"] },
        ],
    },
];

export function getRentalById(id: number): Rental | undefined {
    return RENTALS.find((r) => r.id === id);
}
