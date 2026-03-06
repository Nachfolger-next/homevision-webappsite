'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Map as MapIcon, List, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertySearch from '@/components/booking/PropertySearch';
import PropertyCard from '@/components/booking/PropertyCard';
import FilterBar, { FilterState } from '@/components/booking/FilterBar';
import type { PropertyListing } from '@/lib/hostaway-types';
import type { Locale } from '@/i18n-config';

// Lazy-load map to avoid SSR issues with Mapbox GL
const PropertyMap = dynamic(() => import('@/components/booking/PropertyMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-[var(--color-neutral-100)] animate-pulse flex items-center justify-center">
            <MapIcon size={32} className="text-[var(--color-neutral-300)]" />
        </div>
    ),
});

interface PropertiesClientProps {
    lang: Locale;
}

export default function PropertiesClient({ lang }: PropertiesClientProps) {
    const [listings, setListings] = useState<PropertyListing[]>([]);
    const [availableIds, setAvailableIds] = useState<number[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [hasSearched, setHasSearched] = useState(false);
    const [filters, setFilters] = useState<FilterState>({});
    const [searchDates, setSearchDates] = useState<{ checkIn: string; checkOut: string; guests: number } | null>(null);
    const [pricingMap, setPricingMap] = useState<Record<number, number>>({}); // listingId -> all-in nightly rate

    // Map state
    const [showMap, setShowMap] = useState(true);
    const [hoveredListingId, setHoveredListingId] = useState<number | null>(null);
    const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
    const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

    // Fetch all listings on mount
    useEffect(() => {
        async function fetchListings() {
            try {
                const res = await fetch(`/api/hostaway/listings?lang=${lang}`);
                const data = await res.json();
                if (data.success) {
                    setListings(data.data);
                }
            } catch (err) {
                console.error('Failed to fetch listings:', err);
            } finally {
                setInitialLoading(false);
            }
        }
        fetchListings();
    }, []);

    // Get unique locations for the location filter
    const locations = useMemo(
        () => [...new Set(listings.map((l) => l.city))],
        [listings]
    );

    // Search handler
    const handleSearch = async (params: {
        checkIn: string;
        checkOut: string;
        guests: number;
        location?: string;
    }) => {
        setLoading(true);
        setHasSearched(true);
        setSearchDates({ checkIn: params.checkIn, checkOut: params.checkOut, guests: params.guests });

        try {
            const res = await fetch(
                `/api/hostaway/availability?startDate=${params.checkIn}&endDate=${params.checkOut}`
            );
            const data = await res.json();

            if (data.success) {
                let ids: number[] = data.data;

                // Filter by guest capacity
                ids = ids.filter((id) => {
                    const listing = listings.find((l) => l.id === id);
                    return listing && listing.personCapacity >= params.guests;
                });

                // Filter by location if specified
                if (params.location) {
                    ids = ids.filter((id) => {
                        const listing = listings.find((l) => l.id === id);
                        return listing && listing.city === params.location;
                    });
                }

                setAvailableIds(ids);

                // Batch-fetch pricing for each available listing
                const pricingPromises = ids.map(async (id) => {
                    try {
                        const pRes = await fetch('/api/hostaway/pricing', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                listingId: id,
                                startDate: params.checkIn,
                                endDate: params.checkOut,
                                guests: params.guests,
                            }),
                        });
                        const pData = await pRes.json();
                        if (pData.success) {
                            const d = pData.data;
                            // All-in rate = (accommodation + cleaning) / nights
                            const allIn = (d.nightlyRate * d.nights + d.cleaningFee) / d.nights;
                            return { id, rate: allIn };
                        }
                    } catch { /* skip this listing */ }
                    return null;
                });
                const results = await Promise.all(pricingPromises);
                const map: Record<number, number> = {};
                for (const r of results) {
                    if (r) map[r.id] = r.rate;
                }
                setPricingMap(map);
            }
        } catch (err) {
            console.error('Search failed:', err);
        } finally {
            setLoading(false);
        }
    };

    // Apply filters to displayed listings
    const displayedListings = useMemo(() => {
        let result = listings;

        // If searched, filter by availability
        if (hasSearched && availableIds !== null) {
            result = result.filter((l) => availableIds.includes(l.id));
        }

        // Apply filters
        if (filters.priceMin !== undefined) {
            result = result.filter((l) => l.price >= (filters.priceMin ?? 0));
        }
        if (filters.priceMax !== undefined) {
            result = result.filter((l) => l.price <= (filters.priceMax ?? Infinity));
        }
        if (filters.petFriendly) {
            result = result.filter((l) => l.petsAllowed);
        }
        if (filters.bedrooms !== undefined) {
            result = result.filter((l) =>
                filters.bedrooms === 3
                    ? l.bedroomsNumber >= 3
                    : l.bedroomsNumber === filters.bedrooms
            );
        }

        return result;
    }, [listings, availableIds, hasSearched, filters]);

    const headlineText: Record<Locale, string> = {
        el: 'Βρείτε τη Διαμονή σας',
        en: 'Find Your Stay',
        ru: 'Найдите своё жильё',
        tr: 'Konaklamanızı Bulun',
        bg: 'Намерете престоя си',
        he: 'מצאו את השהייה שלכם',
    };

    const subtitleText: Record<Locale, string> = {
        el: 'Επιλέξτε ημερομηνίες για να δείτε τα διαθέσιμα ακίνητα',
        en: 'Select your dates to see available properties',
        ru: 'Выберите даты, чтобы увидеть доступные объекты',
        tr: 'Müsait mülkleri görmek için tarihlerinizi seçin',
        bg: 'Изберете дати, за да видите наличните имоти',
        he: 'בחרו תאריכים כדי לראות נכסים זמינים',
    };

    const propertiesAvailable: Record<Locale, (n: number) => string> = {
        el: (n) => `${n} ${n === 1 ? 'ακίνητο διαθέσιμο' : 'ακίνητα διαθέσιμα'}`,
        en: (n) => `${n} propert${n === 1 ? 'y' : 'ies'} available`,
        ru: (n) => `${n} ${n === 1 ? 'объект доступен' : 'объектов доступно'}`,
        tr: (n) => `${n} mülk müsait`,
        bg: (n) => `${n} ${n === 1 ? 'имот наличен' : 'имота налични'}`,
        he: (n) => `${n} ${n === 1 ? 'נכס זמין' : 'נכסים זמינים'}`,
    };

    const propertiesCount: Record<Locale, (n: number) => string> = {
        el: (n) => `${n} ακίνητα`,
        en: (n) => `${n} properties`,
        ru: (n) => `${n} объектов`,
        tr: (n) => `${n} mülk`,
        bg: (n) => `${n} имота`,
        he: (n) => `${n} נכσים`,
    };

    const noPropertiesTitle: Record<Locale, string> = {
        el: 'Δεν υπάρχουν διαθέσιμα ακίνητα',
        en: 'No properties available',
        ru: 'Нет доступных объектов',
        tr: 'Müsait mülk yok',
        bg: 'Няма налични имоти',
        he: 'אין נכסים זמינים',
    };

    const noPropertiesSubtitle: Record<Locale, string> = {
        el: 'Δοκιμάστε διαφορετικές ημερομηνίες ή αλλάξτε τα φίλτρα σας.',
        en: 'Try different dates or adjust your filters to see more results.',
        ru: 'Попробуйте другие даты или измените фильтры.',
        tr: 'Farklı tarihler deneyin veya filtrelerinizi ayarlayın.',
        bg: 'Опитайте с различни дати или променете филтрите си.',
        he: 'נסו תאריכים אחרים או שנו את המסננים.',
    };

    const mapToggleText: Record<Locale, { showMap: string; showList: string; map: string; list: string }> = {
        el: { showMap: 'Χάρτης', showList: 'Λίστα', map: 'Χάρτης', list: 'Λίστα' },
        en: { showMap: 'Show map', showList: 'Show list', map: 'Map', list: 'List' },
        ru: { showMap: 'Карта', showList: 'Список', map: 'Карта', list: 'Список' },
        tr: { showMap: 'Harita', showList: 'Liste', map: 'Harita', list: 'Liste' },
        bg: { showMap: 'Карта', showList: 'Списък', map: 'Карта', list: 'Списък' },
        he: { showMap: 'מפה', showList: 'רשימה', map: 'מפה', list: 'רשימה' },
    };

    const handleHoverListing = useCallback((id: number | null) => {
        setHoveredListingId(id);
    }, []);

    const handleSelectMapListing = useCallback((id: number | null) => {
        setSelectedListingId(id);
    }, []);

    // Determine if we have listings with geo data to show map
    const hasGeoListings = displayedListings.some(l => l.lat && l.lng);

    // Rendering helpers
    const renderListingCards = (gridCols: string) => (
        <div className={gridCols}>
            {displayedListings.map((listing, index) => (
                <div
                    key={listing.id}
                    onMouseEnter={() => handleHoverListing(listing.id)}
                    onMouseLeave={() => handleHoverListing(null)}
                >
                    <PropertyCard
                        property={listing}
                        lang={lang}
                        index={index}
                        checkIn={searchDates?.checkIn}
                        checkOut={searchDates?.checkOut}
                        guests={searchDates?.guests}
                        allInNightlyRate={pricingMap[listing.id]}
                    />
                </div>
            ))}
        </div>
    );

    const renderSkeletons = (count: number, gridCols: string) => (
        <div className={gridCols}>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white rounded-2xl overflow-hidden shadow-accent-sm animate-pulse"
                >
                    <div className="aspect-[4/3] bg-[var(--color-neutral-200)]" />
                    <div className="p-6 space-y-3">
                        <div className="h-3 w-20 bg-[var(--color-neutral-200)] rounded" />
                        <div className="h-6 w-3/4 bg-[var(--color-neutral-200)] rounded" />
                        <div className="h-3 w-1/2 bg-[var(--color-neutral-200)] rounded" />
                    </div>
                </div>
            ))}
        </div>
    );

    const renderEmptyState = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
        >
            <div className="w-16 h-16 rounded-full bg-[var(--color-neutral-100)] flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
            </div>
            <h3 className="font-serif text-xl text-[var(--color-text)] mb-2">
                {noPropertiesTitle[lang]}
            </h3>
            <p className="text-sm text-[var(--color-neutral-500)] max-w-sm mx-auto">
                {noPropertiesSubtitle[lang]}
            </p>
        </motion.div>
    );

    return (
        <>
            <Header lang={lang} theme="dark" mode="guest" />

            <main className="min-h-screen bg-[var(--color-background)]">
                {/* Hero Section */}
                <section className="relative bg-[#13242E] pt-32 pb-20 md:pt-40 md:pb-28 2xl:pb-40 grain-overlay overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a4d]/80 via-[#447d9c]/20 to-[#13242E]" />

                    <div className="container relative z-10">
                        {/* Signature line */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 60 }}
                            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="h-[2px] bg-[var(--color-warm)] mb-6 md:mx-auto md:mb-8"
                        />

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="font-serif text-4xl md:text-7xl text-white font-light tracking-[-0.03em] mb-4 md:text-center"
                        >
                            {headlineText[lang]}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="text-white/60 text-sm md:text-base md:text-center mb-10 max-w-xl mx-auto"
                        >
                            {subtitleText[lang]}
                        </motion.p>

                        {/* Search Bar */}
                        <PropertySearch
                            onSearch={handleSearch}
                            lang={lang}
                            loading={loading}
                            locations={locations}
                        />
                    </div>
                </section>

                {/* Results Section — Airbnb Split Layout */}
                <section className="relative">
                    {/* Filter Bar */}
                    {listings.length > 0 && (
                        <div className="container pt-8 md:pt-16 lg:pt-24 2xl:pt-32 pb-4 md:pb-6 border-b border-[var(--color-neutral-200)]">
                            <div className="flex items-center justify-between gap-4">
                                <FilterBar onFilter={setFilters} activeFilters={filters} lang={lang} />

                                {/* Desktop map toggle (Premium Segmented Control) */}
                                {hasGeoListings && (
                                    <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[var(--color-neutral-200)] border border-[var(--color-neutral-300)] shadow-inner w-fit">
                                        <button
                                            onClick={() => setShowMap(false)}
                                            className={`
                                                flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 w-24
                                                ${!showMap
                                                    ? 'bg-white text-[var(--color-text)] shadow-sm cursor-default'
                                                    : 'text-[var(--color-neutral-600)] hover:text-[var(--color-text)] cursor-pointer'
                                                }
                                            `}
                                        >
                                            <List size={14} />
                                            {mapToggleText[lang].list}
                                        </button>
                                        <button
                                            onClick={() => setShowMap(true)}
                                            className={`
                                                flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 w-24
                                                ${showMap
                                                    ? 'bg-white text-[var(--color-text)] shadow-sm cursor-default'
                                                    : 'text-[var(--color-neutral-600)] hover:text-[var(--color-text)] cursor-pointer'
                                                }
                                            `}
                                        >
                                            <MapIcon size={14} />
                                            {mapToggleText[lang].map}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Results Count */}
                    <div className="container pt-4">
                        {hasSearched && !loading && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-[var(--color-neutral-500)] mb-4"
                            >
                                {propertiesAvailable[lang](displayedListings.length)}
                            </motion.p>
                        )}
                        {!initialLoading && !hasSearched && listings.length > 0 && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-[var(--color-neutral-500)] mb-4"
                            >
                                {propertiesCount[lang](displayedListings.length)}
                            </motion.p>
                        )}
                    </div>

                    {/* =============== DESKTOP: Split Layout =============== */}
                    <div className="hidden md:block">
                        {showMap && hasGeoListings && !initialLoading ? (
                            /* Split view: list left + map right */
                            <div className="flex relative items-start">
                                {/* Left: Scrollable listing cards (naturally controls page height) */}
                                <div className="w-[55%] xl:w-[60%] px-6 pb-20 pt-2">
                                    {loading
                                        ? renderSkeletons(4, 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6')
                                        : displayedListings.length > 0
                                            ? renderListingCards('grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6')
                                            : hasSearched && renderEmptyState()
                                    }
                                </div>

                                {/* Right: Sticky map */}
                                <div
                                    className="flex-1 sticky self-start"
                                    style={{
                                        top: '80px', // Header offset
                                        height: 'calc(100vh - 80px)'
                                    }}
                                >
                                    <PropertyMap
                                        listings={displayedListings}
                                        hoveredId={hoveredListingId}
                                        selectedId={selectedListingId}
                                        onSelectListing={handleSelectMapListing}
                                        lang={lang}
                                        pricingMap={pricingMap}
                                        checkIn={searchDates?.checkIn}
                                        checkOut={searchDates?.checkOut}
                                        guests={searchDates?.guests}
                                    />
                                </div>
                            </div>
                        ) : (
                            /* Full-width grid (no map) */
                            <div className="container py-8 pb-24">
                                {(initialLoading || loading)
                                    ? renderSkeletons(4, 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6')
                                    : displayedListings.length > 0
                                        ? renderListingCards('grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6')
                                        : hasSearched && renderEmptyState()
                                }
                            </div>
                        )}
                    </div>

                    {/* =============== MOBILE: Toggle List / Map =============== */}
                    <div className="md:hidden">
                        {/* Content */}
                        <AnimatePresence mode="wait">
                            {mobileView === 'list' ? (
                                <motion.div
                                    key="mobile-list"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="container py-6"
                                >
                                    {(initialLoading || loading)
                                        ? renderSkeletons(2, 'grid grid-cols-1 gap-6')
                                        : displayedListings.length > 0
                                            ? renderListingCards('grid grid-cols-1 gap-6')
                                            : hasSearched && renderEmptyState()
                                    }
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="mobile-map"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ height: 'calc(100vh - 80px)' }}
                                >
                                    {hasGeoListings && (
                                        <PropertyMap
                                            listings={displayedListings}
                                            hoveredId={null}
                                            selectedId={selectedListingId}
                                            onSelectListing={handleSelectMapListing}
                                            lang={lang}
                                            pricingMap={pricingMap}
                                            checkIn={searchDates?.checkIn}
                                            checkOut={searchDates?.checkOut}
                                            guests={searchDates?.guests}
                                        />
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Floating toggle button */}
                        {hasGeoListings && !initialLoading && (
                            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                                <button
                                    onClick={() => setMobileView(mobileView === 'list' ? 'map' : 'list')}
                                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#13242E] text-white text-sm font-semibold shadow-2xl cursor-pointer"
                                >
                                    {mobileView === 'list' ? (
                                        <>
                                            <MapIcon size={16} />
                                            {mapToggleText[lang].map}
                                        </>
                                    ) : (
                                        <>
                                            <List size={16} />
                                            {mapToggleText[lang].list}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer lang={lang} />
        </>
    );
}
