'use client';

import { useRef, useCallback, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { PropertyListing } from '@/lib/hostaway-types';
import { Star, Map as MapIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

// Thessaloniki center as default
const DEFAULT_CENTER = { lat: 40.6401, lng: 22.9444 };

interface PropertyMapProps {
    listings: PropertyListing[];
    hoveredId: number | null;
    selectedId: number | null;
    onSelectListing: (id: number | null) => void;
    lang: string;
    pricingMap?: Record<number, number>;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
}

export default function PropertyMap({
    listings,
    hoveredId,
    selectedId,
    onSelectListing,
    lang,
    pricingMap = {},
    checkIn,
    checkOut,
    guests,
}: PropertyMapProps) {
    const mapRef = useRef<any>(null);

    // Compute center from listings
    const center = listings.length > 0
        ? {
            lat: listings.reduce((s, l) => s + l.lat, 0) / listings.length,
            lng: listings.reduce((s, l) => s + l.lng, 0) / listings.length,
        }
        : DEFAULT_CENTER;

    // Fly to fit all markers when listings change
    useEffect(() => {
        const map = mapRef.current;
        if (!map || listings.length === 0) return;

        if (listings.length === 1) {
            map.flyTo({ center: [listings[0].lng, listings[0].lat], zoom: 14, duration: 1200 });
            return;
        }

        // Build bounds
        const lngs = listings.map(l => l.lng);
        const lats = listings.map(l => l.lat);
        const sw = [Math.min(...lngs), Math.min(...lats)] as [number, number];
        const ne = [Math.max(...lngs), Math.max(...lats)] as [number, number];

        map.fitBounds([sw, ne], { padding: 60, duration: 1200, maxZoom: 15 });
    }, [listings]);

    const selectedListing = listings.find(l => l.id === selectedId);

    const handleMapClick = useCallback(() => {
        onSelectListing(null);
    }, [onSelectListing]);

    const queryParams = [checkIn && `checkIn=${checkIn}`, checkOut && `checkOut=${checkOut}`, guests && `guests=${guests}`].filter(Boolean).join('&');
    const dateParams = queryParams ? `?${queryParams}` : '';

    return (
        <Map
            ref={mapRef}
            initialViewState={{
                longitude: center.lng,
                latitude: center.lat,
                zoom: 13,
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
            onClick={handleMapClick}
            reuseMaps
            attributionControl={false}
            scrollZoom={false} // UX: Prevent scroll trap on desktop
            cooperativeGestures={true} // Add "Use Ctrl + scroll to zoom" overlay (if supported by mapbox version)
        >
            <NavigationControl position="top-right" showCompass={false} />

            {listings.map((listing) => {
                const isHovered = listing.id === hoveredId;
                const isSelected = listing.id === selectedId;
                const price = pricingMap[listing.id] ?? listing.price;
                const isActive = isHovered || isSelected;

                return (
                    <Marker
                        key={listing.id}
                        longitude={listing.lng}
                        latitude={listing.lat}
                        anchor="bottom"
                        style={{ zIndex: isActive ? 50 : 1 }}
                        onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            onSelectListing(listing.id);
                        }}
                    >
                        <div className="relative group cursor-pointer flex flex-col items-center justify-center">
                            {/* Marker Body */}
                            <div
                                className={`
                                    px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300
                                    shadow-lg border
                                    flex items-center gap-1
                                    ${isActive
                                        ? 'bg-[#13242E] text-white border-[#13242E] scale-110 shadow-2xl shadow-[#13242E]/30'
                                        : 'bg-white/95 backdrop-blur text-[#13242E] border-neutral-200 hover:scale-105 hover:shadow-xl'
                                    }
                                `}
                            >
                                €{Math.round(price)}
                            </div>

                            {/* Animated Sonar Ring for active state */}
                            {isActive && (
                                <div className="absolute inset-0 top-0 left-0 right-0 bottom-0 pointer-events-none flex items-center justify-center -z-10 mt-[-6px]">
                                    <span className="absolute w-[calc(100%+8px)] h-[calc(100%+8px)] rounded-full border-2 border-[#13242E]/40 animate-ping opacity-75"></span>
                                </div>
                            )}

                            {/* Pointer Triangle */}
                            <div
                                className={`
                                    w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-x-transparent transition-all duration-300
                                    ${isActive ? 'border-t-[#13242E] scale-110 mt-[-1px]' : 'border-t-white hover:scale-105 mt-[-1px]'}
                                `}
                                style={{
                                    filter: isActive ? 'drop-shadow(0 4px 3px rgba(19,36,46,0.2))' : 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))'
                                }}
                            />
                        </div>
                    </Marker>
                );
            })}

            {/* Popup for selected listing */}
            {selectedListing && (
                <Popup
                    longitude={selectedListing.lng}
                    latitude={selectedListing.lat}
                    anchor="bottom"
                    offset={[0, -32]} /* Offset to clear the point marker */
                    closeOnClick={false}
                    onClose={() => onSelectListing(null)}
                    maxWidth="300px"
                    className="
                        [&_.mapboxgl-popup-content]:p-0
                        [&_.mapboxgl-popup-content]:rounded-2xl
                        [&_.mapboxgl-popup-content]:shadow-2xl
                        [&_.mapboxgl-popup-content]:shadow-black/20
                        [&_.mapboxgl-popup-content]:border
                        [&_.mapboxgl-popup-content]:border-neutral-200/50
                        [&_.mapboxgl-popup-content]:bg-white/95
                        [&_.mapboxgl-popup-content]:backdrop-blur-xl
                        [&_.mapboxgl-popup-close-button]:top-2
                        [&_.mapboxgl-popup-close-button]:right-2
                        [&_.mapboxgl-popup-close-button]:w-6
                        [&_.mapboxgl-popup-close-button]:h-6
                        [&_.mapboxgl-popup-close-button]:rounded-full
                        [&_.mapboxgl-popup-close-button]:bg-black/50
                        [&_.mapboxgl-popup-close-button]:text-white
                        [&_.mapboxgl-popup-close-button]:transition-all
                        [&_.mapboxgl-popup-close-button:hover]:bg-black/70
                        [&_.mapboxgl-popup-close-button:hover]:scale-110
                        [&_.mapboxgl-popup-tip]:border-t-white/95
                        z-50
                    "
                >
                    <Link
                        href={`/${lang}/properties/${selectedListing.slug}${dateParams}`}
                        className="block group"
                    >
                        {/* Image Container with Mini Swiper Simulation */}
                        <div className="relative w-full aspect-[16/10] rounded-t-2xl overflow-hidden bg-neutral-100">
                            {selectedListing.images && selectedListing.images.length > 0 ? (
                                <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                                    {selectedListing.images.slice(0, 5).map((img, i) => (
                                        <div key={i} className="flex-none w-full h-full relative snap-center">
                                            <Image
                                                src={img.url}
                                                alt={`${selectedListing.name} - ${i + 1}`}
                                                fill
                                                sizes="300px"
                                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400">
                                    No Image
                                </div>
                            )}

                            {/* Pagination Dots Indicator */}
                            {selectedListing.images && selectedListing.images.length > 1 && (
                                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                                    {selectedListing.images.slice(0, 5).map((_, i) => (
                                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white shadow' : 'bg-white/50'}`} />
                                    ))}
                                </div>
                            )}

                            {/* Optional: Add to favorites heart icon could go here */}
                        </div>

                        {/* Content */}
                        <div className="p-4 bg-white/50 backdrop-blur-sm rounded-b-2xl">
                            <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-accent)] font-semibold mb-1 flex items-center gap-1.5">
                                <MapIcon size={10} />
                                {selectedListing.city}
                            </p>
                            <h4 className="font-serif text-base text-[var(--color-text)] leading-tight mb-2 line-clamp-1 group-hover:text-[var(--color-accent)] transition-colors">
                                {selectedListing.name}
                            </h4>

                            <div className="flex items-end justify-between mt-3">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-neutral-500 mb-0.5">Total price</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-sm font-bold text-[var(--color-text)] tracking-tight">
                                            €{Math.round(pricingMap[selectedListing.id] ?? selectedListing.price)}
                                        </span>
                                        <span className="text-[10px] text-neutral-500 font-medium">/night</span>
                                    </div>
                                </div>

                                {selectedListing.rating ? (
                                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md shadow-sm border border-neutral-100">
                                        <Star size={12} className="text-[var(--color-warm)] fill-[var(--color-warm)]" />
                                        <span className="text-xs font-semibold text-[var(--color-text)]">
                                            {selectedListing.rating.toFixed(2)}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md shadow-sm border border-neutral-100">
                                        <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">New</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                </Popup>
            )}
        </Map>
    );
}
