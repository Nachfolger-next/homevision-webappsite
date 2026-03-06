'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageGallery from '@/components/booking/ImageGallery';
import BookingCard from '@/components/booking/BookingCard';
import BookingForm from '@/components/booking/BookingForm';
import {
    Star,
    MapPin,
    Users,
    BedDouble,
    Bath,
    Clock,
    Wifi,
    Car,
    AirVent,
    Utensils,
    Tv,
    WashingMachine,
    PawPrint,
    Shield,
    ChevronDown,
    ChevronUp,
    Waves,
    Flame,
    Coffee,
    Snowflake,
    ShowerHead,
    Dumbbell,
    Wind,
    CookingPot,
    Refrigerator,
    Microwave,
    DoorOpen,
    Building2,
    TreePine,
    Shirt,
    BatteryCharging,
    Baby,
    Mountain,
    Sunrise,
    CheckCircle,
    Briefcase,
    Gamepad2,
    BookOpen,
    Music,
    Accessibility,
    Activity,
    Key,
    UtensilsCrossed,
    Cigarette,
    GlassWater,
    LucideIcon,
} from 'lucide-react';
import type { PropertyListing, HostawayReview } from '@/lib/hostaway-types';
import type { Locale } from '@/i18n-config';
import { t, Dictionary } from '@/lib/get-dictionary';

// Map common amenity name keywords to Lucide icons
const AMENITY_ICON_KEYWORDS: [string[], LucideIcon][] = [
    [['wifi', 'wi-fi', 'internet', 'wireless', 'pocket wifi'], Wifi],
    [['air conditioning', 'ac ', 'a/c', 'air-conditioning', 'central air', 'cooling', 'fan'], AirVent],
    [['tv', 'television', 'hdtv', 'smart tv', 'cable', 'satellite'], Tv],
    [['kitchen', 'kitchenette', 'oven', 'stove', 'microwave', 'refrigerator', 'fridge', 'freezer', 'cooking', 'utensil', 'dish', 'dishwasher', 'coffee', 'espresso', 'teapot', 'kettle', 'toaster', 'blender', 'dining', 'baking', 'spice', 'oil', 'salt'], Utensils],
    [['washer', 'washing machine', 'laundry', 'dryer', 'iron', 'ironing', 'hanger', 'wardrobe', 'closet', 'clothing', 'laundromat'], Shirt],
    [['parking', 'garage', 'car', 'vehicle', 'ev charger', 'valet', 'driveway'], Car],
    [['pool', 'swimming', 'hot tub', 'jacuzzi', 'sauna', 'spa', 'tubing'], Waves],
    [['heating', 'heater', 'radiator', 'heated', 'fireplace', 'fire pit', 'stove'], Flame],
    [['coffee', 'espresso', 'nespresso'], Coffee],
    [['refrigerator', 'fridge', 'freezer', 'mini fridge', 'ice maker'], Refrigerator],
    [['microwave'], Microwave],
    [['oven', 'stove', 'cooking'], CookingPot],
    [['shower', 'bath', 'hot water', 'bathtub', 'bidet', 'toilet', 'shampoo', 'soap', 'conditioner', 'towel', 'hair dryer', 'body soap', 'shower gel'], ShowerHead],
    [['gym', 'fitness', 'exercise', 'workout'], Dumbbell],
    [['balcony', 'terrace', 'patio', 'deck', 'outdoor', 'garden', 'yard', 'backyard', 'bbq', 'barbecue', 'grill', 'firepit', 'hammock', 'sunlounger'], TreePine],
    [['elevator', 'lift'], Building2],
    [['ev charger', 'charging station'], BatteryCharging],
    [['crib', 'baby', 'child', 'high chair', 'children', 'infant', 'toddler', 'play', 'toys', 'babysitter', 'changing table'], Baby],
    [['view', 'mountain', 'sea view', 'ocean view', 'lake', 'river', 'waterfront', 'beach', 'bay', 'city view'], Mountain],
    [['smoke', 'fire', 'carbon monoxide', 'safety', 'detector', 'alarm', 'extinguisher', 'first aid', 'emergency', 'safe', 'security', 'guard', 'deadbolt', 'lock'], Shield],
    [['bed ', 'bedroom', 'pillow', 'linen', 'blanket', 'room darkening', 'shades'], BedDouble],
    [['pet', 'dog', 'cat', 'animal'], PawPrint],
    [['freezer', 'ice', 'snow', 'cold'], Snowflake],
    [['workspace', 'desk', 'office', 'computer', 'monitor', 'printer'], Briefcase],
    [['game', 'console', 'video game', 'ping pong', 'billiards', 'pool table', 'foosball', 'board game', 'toy'], Gamepad2],
    [['book', 'reading', 'library'], BookOpen],
    [['music', 'sound system', 'stereo', 'record player', 'piano'], Music],
    [['wheelchair', 'accessible', 'disabled', 'hoist', 'grab rails', 'rollin shower', 'step-free', 'wide doorway', 'accessible height'], Accessibility],
    [['sport', 'ski', 'golf', 'tennis', 'bicycle', 'boat', 'kayak', 'fishing', 'horseback', 'surf', 'hiking', 'rafting', 'scuba', 'snorkeling', 'riding'], Activity],
    [['checkin', 'doorman', 'key card', 'entrance', 'lock', 'staff', 'butler', 'chef', 'housekeeper', 'bartender'], Key],
    [['breakfast', 'meal', 'grocery', 'wine', 'glass', 'dining set', 'dining room'], UtensilsCrossed],
    [['smoking allowed', 'smoking'], Cigarette],
    [['water', 'drinking water', 'bottle'], GlassWater]
];

function getAmenityIcon(name: string): LucideIcon {
    const lower = name.toLowerCase();
    for (const [keywords, Icon] of AMENITY_ICON_KEYWORDS) {
        if (keywords.some((kw) => lower.includes(kw))) {
            return Icon;
        }
    }
    return CheckCircle;
}

interface PropertyDetailClientProps {
    property: PropertyListing;
    lang: Locale;
    amenityMap: Record<number, string>;
    englishAmenityMap: Record<number, string>;
    dict: Dictionary;
}

export default function PropertyDetailClient({
    property,
    lang,
    amenityMap,
    englishAmenityMap,
    dict,
}: PropertyDetailClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialCheckIn = searchParams.get('checkIn') || '';
    const initialCheckOut = searchParams.get('checkOut') || '';
    const initialGuests = parseInt(searchParams.get('guests') || '2', 10);
    const [reviews, setReviews] = useState<HostawayReview[]>([]);
    const [bookingStep, setBookingStep] = useState<'browse' | 'form'>('browse');
    const [pricingLoading, setPricingLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [confirmationId, setConfirmationId] = useState('');
    const [descExpanded, setDescExpanded] = useState(false);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [pricingData, setPricingData] = useState<{
        nights: number;
        nightlyRate: number;
        cleaningFee: number;
        extraPersonFee: number;
        taxes: number;
        couponDiscount: number;
        lengthDiscount: number;
        lengthDiscountLabel: string;
        total: number;
    } | null>(null);
    const [bookingParams, setBookingParams] = useState({
        checkIn: '',
        checkOut: '',
        guests: 2,
        couponCode: '',
    });

    const descRef = useRef<HTMLDivElement>(null);
    const [descOverflows, setDescOverflows] = useState(false);

    // Check if description overflows (needs "Show more")
    useEffect(() => {
        if (descRef.current) {
            setDescOverflows(descRef.current.scrollHeight > descRef.current.clientHeight);
        }
    }, [property.description]);

    // Fetch reviews
    useEffect(() => {
        async function fetchReviews() {
            try {
                const res = await fetch(`/api/hostaway/reviews?listingId=${property.id}&lang=${lang}`);
                const data = await res.json();
                if (data.success) {
                    setReviews(data.data);
                }
            } catch (err) {
                console.error('Failed to fetch reviews:', err);
            }
        }
        fetchReviews();
    }, [property.id]);

    // Auto-fetch pricing when dates arrive from URL search params
    useEffect(() => {
        if (initialCheckIn && initialCheckOut) {
            (async () => {
                setPricingLoading(true);
                try {
                    const res = await fetch('/api/hostaway/pricing', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            listingId: property.id,
                            startDate: initialCheckIn,
                            endDate: initialCheckOut,
                            guests: initialGuests,
                        }),
                    });
                    const data = await res.json();
                    if (data.success) {
                        setPricingData(data.data);
                    }
                } catch (err) {
                    console.error('Auto-pricing failed:', err);
                } finally {
                    setPricingLoading(false);
                }
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle booking request (first step: calculate price)
    const handleBookingRequest = async (params: {
        checkIn: string;
        checkOut: string;
        guests: number;
        couponCode?: string;
    }) => {
        if (!params.checkIn || !params.checkOut) return;

        setPricingLoading(true);
        setBookingParams({
            checkIn: params.checkIn,
            checkOut: params.checkOut,
            guests: params.guests,
            couponCode: params.couponCode || '',
        });

        try {
            const res = await fetch('/api/hostaway/pricing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    listingId: property.id,
                    startDate: params.checkIn,
                    endDate: params.checkOut,
                    guests: params.guests,
                    couponCode: params.couponCode,
                }),
            });
            const data = await res.json();

            if (data.success) {
                setPricingData(data.data);
                setBookingStep('form');
            }
        } catch (err) {
            console.error('Pricing failed:', err);
        } finally {
            setPricingLoading(false);
        }
    };

    // Re-fetch pricing when dates or guests change (without navigating to form)
    const handlePricingChange = async (params: {
        checkIn: string;
        checkOut: string;
        guests: number;
        couponCode?: string;
    }) => {
        if (!params.checkIn || !params.checkOut) return;

        setPricingLoading(true);
        try {
            const res = await fetch('/api/hostaway/pricing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    listingId: property.id,
                    startDate: params.checkIn,
                    endDate: params.checkOut,
                    guests: params.guests,
                    couponCode: params.couponCode,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setPricingData(data.data);
            }
        } catch (err) {
            console.error('Pricing update failed:', err);
        } finally {
            setPricingLoading(false);
        }
    };

    // Handle form submission
    const handleBookingSubmit = async (formData: {
        guestFirstName: string;
        guestLastName: string;
        guestEmail: string;
        guestPhone: string;
        specialRequests: string;
    }) => {
        setBookingLoading(true);

        try {
            const res = await fetch('/api/hostaway/reservation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    listingId: property.id,
                    checkIn: bookingParams.checkIn,
                    checkOut: bookingParams.checkOut,
                    guests: bookingParams.guests,
                    adults: bookingParams.guests,
                    children: 0,
                    totalPrice: pricingData?.total || property.price,
                    currency: property.currencyCode || 'EUR',
                    couponCode: bookingParams.couponCode,
                    ...formData,
                }),
            });
            const data = await res.json();

            if (data.success) {
                setBookingSuccess(true);
                setConfirmationId(data.data.reservationId);
            }
        } catch (err) {
            console.error('Booking failed:', err);
        } finally {
            setBookingLoading(false);
        }
    };

    // Resolved amenities — dynamic from API
    const resolvedAmenities = property.amenityIds
        .map((id) => {
            const name = amenityMap[id];
            const englishName = englishAmenityMap[id];
            if (!name) return null;
            const IconComponent = getAmenityIcon(englishName || name);
            return { icon: <IconComponent size={20} />, label: name };
        })
        .filter(Boolean) as { icon: React.ReactNode; label: string }[];
    const visibleAmenities = showAllAmenities
        ? resolvedAmenities
        : resolvedAmenities.slice(0, 10);

    // Clean description text
    const cleanDescription = (text: string) => {
        return text
            .replace(/#{1,6}\s/g, '')        // Remove markdown headers
            .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')  // Remove bold/italic markers
            .replace(/\n{3,}/g, '\n\n')      // Collapse excessive newlines
            .trim();
    };

    // If in form mode, show the booking form
    if (bookingStep === 'form') {
        return (
            <>
                {/* ── Minimal Checkout Header ── */}
                <header className="fixed top-0 left-0 w-full bg-white z-50 border-b border-[var(--color-neutral-200)] flex items-center h-20 shadow-sm transition-all duration-300">
                    <div className="container flex items-center justify-between">
                        <Link href={`/${lang}/`} className="relative z-50 hover:opacity-80 transition-opacity">
                            <Image src="/logo-color.png" alt="HomeVision" width={180} height={40} className="h-6 w-auto object-contain" priority />
                        </Link>
                        <div className="flex items-center gap-2 text-[var(--color-neutral-500)] text-sm font-medium">
                            <Shield size={16} className="text-[var(--color-accent)]" />
                            <span className="hidden sm:inline">{t(dict, 'booking.secureBooking')}</span>
                        </div>
                    </div>
                </header>

                <main className="min-h-screen bg-[var(--color-surface)] pt-28 pb-20">
                    <div className="container">
                        <BookingForm
                            propertyName={property.name}
                            propertyImage={property.images?.[0]?.url}
                            checkIn={bookingParams.checkIn}
                            checkOut={bookingParams.checkOut}
                            guests={bookingParams.guests}
                            totalPrice={pricingData?.total || property.price}
                            nightlyRate={pricingData?.nightlyRate || 0}
                            cleaningFee={pricingData?.cleaningFee || 0}
                            taxes={pricingData?.taxes || 0}
                            lengthDiscount={pricingData?.lengthDiscount || 0}
                            lengthDiscountLabel={pricingData?.lengthDiscountLabel || ''}
                            currency="€"
                            couponCode={bookingParams.couponCode}
                            couponDiscount={pricingData?.couponDiscount || 0}
                            onSubmit={handleBookingSubmit}
                            onBack={() => setBookingStep('browse')}
                            loading={bookingLoading}
                            success={bookingSuccess}
                            confirmationId={confirmationId}
                            dict={dict}
                        />
                    </div>
                </main>

                {/* ── Minimal Checkout Footer ── */}
                <footer className="bg-white border-t border-[var(--color-neutral-200)] py-8 mt-auto text-center relative z-10">
                    <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-[var(--color-neutral-500)]">
                            &copy; {new Date().getFullYear()} Homevision. All rights reserved.
                        </p>
                        <div className="flex justify-center gap-6 text-xs text-[var(--color-neutral-500)]">
                            <Link href={`/${lang}/privacy`} target="_blank" className="hover:text-[var(--color-text)] transition-colors underline decoration-[var(--color-neutral-300)] underline-offset-4">Privacy Policy</Link>
                            <Link href={`/${lang}/terms`} target="_blank" className="hover:text-[var(--color-text)] transition-colors underline decoration-[var(--color-neutral-300)] underline-offset-4">Terms of Service</Link>
                        </div>
                    </div>
                </footer>
            </>
        );
    }

    return (
        <>
            <Header lang={lang} theme="light" mode="guest" />

            <main className="min-h-screen bg-[var(--color-background)] pt-24 pb-20 md:pb-10">
                <div className="container">
                    {/* ═══════════════════════════════════
                        Image Gallery (Mosaic)
                    ═══════════════════════════════════ */}
                    <section className="mb-6">
                        <ImageGallery images={property.images} propertyName={property.name} dict={dict} />
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-10 md:gap-14">
                        {/* ═══════════════════════════════════
                            Left Column: Property Details
                        ═══════════════════════════════════ */}
                        <div>
                            {/* ── Property Header ── */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="pb-8"
                            >
                                <h1 className="font-serif text-2xl md:text-4xl text-[var(--color-text)] font-light tracking-[-0.02em] mb-3 leading-tight">
                                    {property.name}
                                </h1>

                                {/* Airbnb-style stats row: "X guests · X bedrooms · X baths" */}
                                <div className="flex flex-wrap items-center gap-x-1.5 text-[15px] text-[var(--color-neutral-600)] mb-3">
                                    <span>{property.personCapacity} {t(dict, 'property.guests')}</span>
                                    <span className="text-[var(--color-neutral-300)]">·</span>
                                    <span>{property.bedroomsNumber} {property.bedroomsNumber !== 1 ? t(dict, 'property.bedrooms') : t(dict, 'property.bedroom')}</span>
                                    <span className="text-[var(--color-neutral-300)]">·</span>
                                    <span>{property.bathroomsNumber} {property.bathroomsNumber !== 1 ? t(dict, 'property.bathrooms') : t(dict, 'property.bathroom')}</span>
                                </div>

                                {/* Location + Rating row */}
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1.5 text-[var(--color-neutral-500)]">
                                        <MapPin size={14} />
                                        {property.publicAddress}
                                    </span>
                                    {property.rating && (
                                        <a
                                            href="#reviews"
                                            className="flex items-center gap-1 text-[var(--color-text)] hover:underline"
                                        >
                                            <Star size={14} className="text-[var(--color-warm)] fill-[var(--color-warm)]" />
                                            <span className="font-medium">{property.rating.toFixed(1)}</span>
                                            {reviews.length > 0 && (
                                                <span className="text-[var(--color-neutral-500)]">
                                                    · {reviews.length} {reviews.length !== 1 ? t(dict, 'property.reviews') : t(dict, 'property.review')}
                                                </span>
                                            )}
                                        </a>
                                    )}
                                    {property.petsAllowed && (
                                        <span className="flex items-center gap-1 text-[var(--color-accent)] text-xs font-medium bg-[var(--color-accent)]/5 px-2.5 py-1 rounded-full">
                                            <PawPrint size={13} />
                                            {t(dict, 'property.petFriendly')}
                                        </span>
                                    )}
                                </div>
                            </motion.div>

                            {/* ── Section divider ── */}
                            <div className="border-t border-[var(--color-neutral-200)]" />

                            {/* ── Description ── */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.05 }}
                                className="py-8"
                            >
                                <h2 className="font-serif text-xl text-[var(--color-text)] mb-4">
                                    {t(dict, 'property.aboutThisProperty')}
                                </h2>
                                <div className="relative">
                                    <div
                                        ref={descRef}
                                        className={`text-[15px] text-[var(--color-neutral-600)] leading-relaxed whitespace-pre-line transition-all duration-300 ${!descExpanded ? 'max-h-[120px] overflow-hidden' : ''
                                            }`}
                                    >
                                        {cleanDescription(property.description)}
                                    </div>

                                    {/* Gradient fade when collapsed */}
                                    {!descExpanded && descOverflows && (
                                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[var(--color-background)] to-transparent pointer-events-none" />
                                    )}
                                </div>

                                {descOverflows && (
                                    <button
                                        onClick={() => setDescExpanded(!descExpanded)}
                                        className="mt-3 flex items-center gap-1.5 text-[var(--color-text)] font-semibold text-sm underline underline-offset-4 hover:text-[var(--color-accent)] transition-colors cursor-pointer"
                                    >
                                        {descExpanded ? (
                                            <>{t(dict, 'property.showLess')} <ChevronUp size={14} /></>
                                        ) : (
                                            <>{t(dict, 'property.showMore')} <ChevronDown size={14} /></>
                                        )}
                                    </button>
                                )}
                            </motion.section>

                            {/* ── Section divider ── */}
                            <div className="border-t border-[var(--color-neutral-200)]" />

                            {/* ── Amenities ── */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="py-8"
                            >
                                <h2 className="font-serif text-xl text-[var(--color-text)] mb-5">
                                    {t(dict, 'property.whatThisPlaceOffers')}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                    {visibleAmenities.map((amenity, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-4 py-1"
                                        >
                                            <span className="text-[var(--color-neutral-600)] flex-shrink-0">
                                                {amenity.icon}
                                            </span>
                                            <span className="text-[15px] text-[var(--color-neutral-700)]">
                                                {amenity.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {resolvedAmenities.length > 8 && (
                                    <button
                                        onClick={() => setShowAllAmenities(!showAllAmenities)}
                                        className="mt-5 px-6 py-3 border border-[var(--color-text)] rounded-lg text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-neutral-100)] transition-colors cursor-pointer"
                                    >
                                        {showAllAmenities
                                            ? t(dict, 'property.showLess')
                                            : t(dict, 'property.showAllAmenities').replace('{count}', String(resolvedAmenities.length))}
                                    </button>
                                )}
                            </motion.section>

                            {/* ── Section divider ── */}
                            <div className="border-t border-[var(--color-neutral-200)]" />

                            {/* ── House Rules ── */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.15 }}
                                className="py-8"
                            >
                                <h2 className="font-serif text-xl text-[var(--color-text)] mb-5">
                                    {t(dict, 'property.houseRules')}
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Clock size={20} className="text-[var(--color-neutral-500)] flex-shrink-0" />
                                        <div>
                                            <p className="text-[15px] text-[var(--color-text)]">
                                                {t(dict, 'property.checkIn')}: {property.checkInTimeStart}:00 – {property.checkInTimeEnd}:00
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Clock size={20} className="text-[var(--color-neutral-500)] flex-shrink-0" />
                                        <div>
                                            <p className="text-[15px] text-[var(--color-text)]">
                                                {t(dict, 'property.checkoutBefore')} {property.checkOutTime}:00
                                            </p>
                                        </div>
                                    </div>
                                    {property.minNights > 1 && (
                                        <div className="flex items-center gap-4">
                                            <BedDouble size={20} className="text-[var(--color-neutral-500)] flex-shrink-0" />
                                            <p className="text-[15px] text-[var(--color-text)]">
                                                {t(dict, 'property.minimumStay')}: {property.minNights} {t(dict, 'property.nights')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.section>

                            {/* ── Section divider ── */}
                            <div className="border-t border-[var(--color-neutral-200)]" />

                            {/* ── Reviews ── */}
                            {reviews.length > 0 && (
                                <motion.section
                                    id="reviews"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="py-8"
                                >
                                    {/* Aggregate header */}
                                    <div className="flex items-center gap-2 mb-6">
                                        <Star size={20} className="text-[var(--color-warm)] fill-[var(--color-warm)]" />
                                        <h2 className="font-serif text-xl text-[var(--color-text)]">
                                            {property.rating?.toFixed(1)}
                                        </h2>
                                        <span className="text-[var(--color-neutral-400)]">·</span>
                                        <h2 className="font-serif text-xl text-[var(--color-text)]">
                                            {reviews.length} {reviews.length !== 1 ? t(dict, 'property.reviews') : t(dict, 'property.review')}
                                        </h2>
                                    </div>

                                    {/* 2-column review grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {reviews
                                            .filter(r => r.publicReview && r.publicReview.trim())
                                            .slice(0, showAllReviews ? undefined : 6)
                                            .map((review) => (
                                                <ReviewCard key={review.id} review={review} dict={dict} lang={lang} />
                                            ))}
                                    </div>

                                    {reviews.length > 6 && !showAllReviews && (
                                        <button
                                            onClick={() => setShowAllReviews(true)}
                                            className="mt-6 px-6 py-3 border border-[var(--color-text)] rounded-lg text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-neutral-100)] transition-colors cursor-pointer"
                                        >
                                            {t(dict, 'property.showAllReviews').replace('{count}', String(reviews.length))}
                                        </button>
                                    )}
                                    {showAllReviews && (
                                        <button
                                            onClick={() => setShowAllReviews(false)}
                                            className="mt-6 px-6 py-3 border border-[var(--color-text)] rounded-lg text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-neutral-100)] transition-colors cursor-pointer"
                                        >
                                            {t(dict, 'property.showLess') || 'Show less'}
                                        </button>
                                    )}
                                </motion.section>
                            )}
                        </div>

                        {/* ═══════════════════════════════════
                            Right Column: Booking Card
                        ═══════════════════════════════════ */}
                        <BookingCard
                            price={property.price}
                            onBookingRequest={handleBookingRequest}
                            onPricingChange={handlePricingChange}
                            loading={pricingLoading}
                            pricingData={pricingData}
                            minNights={property.minNights}
                            initialCheckIn={initialCheckIn}
                            initialCheckOut={initialCheckOut}
                            initialGuests={initialGuests}
                            maxGuests={property.personCapacity}
                            listingId={property.id}
                            dict={dict}
                            lang={lang}
                        />
                    </div>
                </div>
            </main>

            <Footer lang={lang} />
        </>
    );
}

/* ═══════════════════════════════════
   Review Card Sub-Component
═══════════════════════════════════ */
function ReviewCard({ review, dict, lang }: { review: HostawayReview; dict: Dictionary; lang: Locale }) {
    const [expanded, setExpanded] = useState(false);
    const [showOriginal, setShowOriginal] = useState(false);

    const textToShow = showOriginal ? review.originalReview || review.publicReview : review.publicReview;
    const isTranslated = !!review.originalReview && review.originalReview !== review.publicReview;
    const isLong = textToShow && textToShow.length > 200;

    // Determine locale string for date formatting
    const localeMap: Record<string, string> = { el: 'el-GR', en: 'en-GB', ru: 'ru-RU', tr: 'tr-TR', bg: 'bg-BG', he: 'he-IL' };
    const dateLocale = localeMap[lang] || 'en-GB';

    return (
        <div>
            {/* Guest info */}
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-neutral-200)] flex items-center justify-center text-sm font-semibold text-[var(--color-neutral-500)]">
                    {review.guestName?.charAt(0)?.toUpperCase() || 'G'}
                </div>
                <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                        {review.guestName}
                    </p>
                    <p className="text-xs text-[var(--color-neutral-500)]">
                        {new Date(review.departureDate).toLocaleDateString(dateLocale, {
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                </div>
            </div>

            {/* Review text */}
            {textToShow && (
                <div>
                    <p className={`text-[15px] text-[var(--color-neutral-600)] leading-relaxed ${!expanded && isLong ? 'line-clamp-3' : ''
                        }`}>
                        {textToShow}
                    </p>
                    <div className="flex items-center gap-4 mt-1.5">
                        {isLong && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="text-sm font-semibold text-[var(--color-text)] underline underline-offset-4 cursor-pointer"
                            >
                                {expanded ? t(dict, 'property.showLess') : t(dict, 'property.showMore')}
                            </button>
                        )}
                        {isTranslated && (
                            <button
                                onClick={() => setShowOriginal(!showOriginal)}
                                className="text-sm font-semibold text-[var(--color-text)] underline underline-offset-4 cursor-pointer"
                            >
                                {showOriginal ? t(dict, 'property.showTranslation', 'Show translation') : t(dict, 'property.showOriginal', 'Show original')}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
