"use client";

import { useEffect, useMemo } from "react";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";

type Rental = {
    id: number;
    address: string;
    neighborhood: string;
    price: number;
    lat: number;
    lng: number;
};

// SVG data URI for the selected (active) marker — gold pin with layered inner dot.
// Use real '#' characters here; encodeURIComponent will encode them to %23 correctly.
// Do NOT pre-encode to %23 in the source string — that causes double-encoding (→ %2523)
// which makes the SVG parser see an invalid colour and fall back to black.
// Default markers use icon={null} → Google Maps native red pin.
const MARKER_ICON_SELECTED =
    "data:image/svg+xml," +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52">' +
        '<path fill="#c9a96e" stroke="#8a6524" stroke-width="1.5" ' +
        'd="M20 2C11.2 2 4 9.2 4 18c0 12 16 32 16 32s16-20 16-32C36 9.2 28.8 2 20 2z"/>' +
        '<circle cx="20" cy="18" r="8.5" fill="#fff"/>' +
        '<circle cx="20" cy="18" r="5" fill="#c9a96e"/>' +
        '<circle cx="20" cy="18" r="2.5" fill="#8a6524"/>' +
        '</svg>'
    );

function MapContent({
    rentals,
    activeId,
    onMarkerClick,
}: {
    rentals: Rental[];
    activeId: number | null;
    onMarkerClick: (id: number) => void;
}) {
    const map = useMap();
    const activeRental = useMemo(() => rentals.find((r) => r.id === activeId), [rentals, activeId]);

    useEffect(() => {
        if (map && activeRental) {
            map.panTo({ lat: activeRental.lat, lng: activeRental.lng });
        }
    }, [map, activeRental]);

    return (
        <>
            {rentals.map((r) => {
                const isActive = r.id === activeId;
                return (
                    <Marker
                        key={r.id}
                        position={{ lat: r.lat, lng: r.lng }}
                        title={`${r.address} — $${r.price.toLocaleString()}/mo`}
                        onClick={() => onMarkerClick(r.id)}
                        zIndex={isActive ? 10 : 1}
                        // Must pass null (not absent) when inactive so @vis.gl calls
                        // marker.setIcon(null) and resets to the native red pin.
                        icon={isActive ? { url: MARKER_ICON_SELECTED } : null}
                    />
                );
            })}
        </>
    );
}

const DEFAULT_CENTER = { lat: 33.99, lng: -118.45 };
const DEFAULT_ZOOM = 10;

export default function ListingsMap({
    rentals,
    activeId,
    onMarkerClick,
}: {
    rentals: Rental[];
    activeId: number | null;
    onMarkerClick: (id: number) => void;
}) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const center = useMemo(() => {
        if (rentals.length === 0) return DEFAULT_CENTER;
        const lat = rentals.reduce((s, r) => s + r.lat, 0) / rentals.length;
        const lng = rentals.reduce((s, r) => s + r.lng, 0) / rentals.length;
        return { lat, lng };
    }, [rentals]);

    if (!apiKey) {
        return (
            <div className="listings-map-fallback">
                <p>Configure <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in <code>.env.local</code> to show the map.</p>
            </div>
        );
    }

    return (
        <APIProvider apiKey={apiKey}>
            <Map
                defaultCenter={center}
                defaultZoom={DEFAULT_ZOOM}
                gestureHandling="greedy"
                disableDefaultUI={false}
                className="listings-map-embed"
                style={{ width: "100%", height: "100%" }}
            >
                <MapContent rentals={rentals} activeId={activeId} onMarkerClick={onMarkerClick} />
            </Map>
        </APIProvider>
    );
}
