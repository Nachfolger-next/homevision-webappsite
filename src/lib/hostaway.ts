// ============================================================
// Hostaway API Client
// Handles OAuth2 auth, token caching, and all booking endpoints
// Docs: https://api.hostaway.com/documentation
// ============================================================

import type {
    HostawayApiResponse,
    HostawayListing,
    HostawayCalendarDay,
    HostawayPriceDetails,
    HostawayReservation,
    HostawayCoupon,
    HostawayReview,
    HostawayAmenity,
    PropertyListing,
    AvailabilityResult,
    PricingResult,
    BookingInquiry,
    BookingConfirmation,
} from './hostaway-types';
import { translateText } from './translate';

// ─── Configuration ──────────────────────────────────────────

const HOSTAWAY_API_BASE = 'https://api.hostaway.com/v1';

function getConfig() {
    const accountId = process.env.HOSTAWAY_ACCOUNT_ID;
    const clientSecret = process.env.HOSTAWAY_CLIENT_SECRET;

    if (!accountId || !clientSecret) {
        throw new Error(
            'Missing Hostaway API credentials. Set HOSTAWAY_ACCOUNT_ID and HOSTAWAY_CLIENT_SECRET in .env.local'
        );
    }

    return { accountId, clientSecret };
}

// ─── Auth Token Management ──────────────────────────────────

let cachedToken: string | null = null;
let tokenExpiry: number = 0;
let tokenRequestPromise: Promise<string> | null = null;

async function getAccessToken(): Promise<string> {
    // Return cached token if still valid (with 5 min buffer)
    if (cachedToken && Date.now() < tokenExpiry - 5 * 60 * 1000) {
        return cachedToken;
    }

    // If a request is already in flight, wait for it instead of starting a new one
    if (tokenRequestPromise) {
        return tokenRequestPromise;
    }

    tokenRequestPromise = (async () => {
        try {
            const { accountId, clientSecret } = getConfig();

            let res: Response | null = null;
            let lastError: any = null;

            // Retry logic for transient network/timeout errors
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    res = await fetch(`${HOSTAWAY_API_BASE}/accessTokens`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Cache-Control': 'no-cache',
                        },
                        body: new URLSearchParams({
                            grant_type: 'client_credentials',
                            client_id: accountId,
                            client_secret: clientSecret,
                            scope: 'general',
                        }),
                        // Short timeout for token requests could be added, but relying on default
                    });

                    if (res.ok) break; // Success

                    // If not ok and it's a 4xx error (auth failed), don't retry
                    if (res.status >= 400 && res.status < 500 && res.status !== 429) {
                        throw new Error(`Hostaway auth failed: ${res.status} ${res.statusText}`);
                    }
                } catch (err: any) {
                    lastError = err;
                    // Log the error but continue to retry
                    console.warn(`Hostaway token fetch attempt ${attempt + 1} failed:`, err.message);
                }

                // Wait before retrying (exponential backoff)
                if (attempt < 2) await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
            }

            if (!res || !res.ok) {
                throw lastError || new Error(`Hostaway auth failed: ${res?.status} ${res?.statusText}`);
            }

            const data = await res.json();
            cachedToken = data.access_token;
            // Token expires_in is in seconds; convert to ms
            tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000;

            return cachedToken!;
        } finally {
            tokenRequestPromise = null; // Clear the promise so future calls check cache
        }
    })();

    return tokenRequestPromise;
}

// ─── API Helper ─────────────────────────────────────────────

async function hostawayFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = await getAccessToken();

    let res: Response | null = null;
    let lastError: any = null;

    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            res = await fetch(`${HOSTAWAY_API_BASE}${endpoint}`, {
                ...options,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                    ...options.headers,
                },
            });

            if (res.ok) break;

            // Don't retry on 400s (Client Errors), except 429 (Rate Limit)
            if (res.status >= 400 && res.status < 500 && res.status !== 429) {
                const body = await res.text();
                throw new Error(
                    `Hostaway API error ${res.status}: ${res.statusText} — ${body}`
                );
            }
        } catch (err: any) {
            lastError = err;
            // Re-throw immediately if it's a client error we intentionally threw above
            if (err.message?.includes('Hostaway API error') && !err.message?.includes('429')) {
                throw err;
            }
            console.warn(`Hostaway fetch attempt ${attempt + 1} failed for ${endpoint}:`, err.message);
        }

        if (attempt < 2) await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }

    if (!res || !res.ok) {
        const statusDetails = res ? `${res.status} ${res.statusText}` : 'Network Failure';
        throw lastError || new Error(`Hostaway API error after 3 attempts (${statusDetails})`);
    }

    const data: HostawayApiResponse<T> = await res.json();

    if (data.status !== 'success') {
        throw new Error(`Hostaway API returned status: ${data.status}`);
    }

    return data.result;
}

// ─── Slug Generation ────────────────────────────────────────

function generateSlug(name: string, id: number): string {
    const base = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    return `${base}-${id}`;
}

// ─── Listing Sanitization ───────────────────────────────────

async function sanitizeListing(
    listing: HostawayListing,
    lang: string = 'en',
    skipDescriptionTranslation: boolean = false
): Promise<PropertyListing> {
    let tDesc = listing.description;

    try {
        if (lang === 'el') {
            const translations = (await import('@/translations/properties-el.json')).default as Record<string, { name: string, description: string }>;
            if (translations[listing.id.toString()]) {
                tDesc = translations[listing.id.toString()].description || tDesc;
            }
        } else if (lang === 'ru') {
            // Safe fallback if 'ru' is added later
            try {
                const translations = (await import(`@/translations/properties-ru.json`)).default as Record<string, { name: string, description: string }>;
                if (translations[listing.id.toString()]) {
                    tDesc = translations[listing.id.toString()].description || tDesc;
                }
            } catch (e) {
                // file missing
            }
        }
    } catch (e) {
        // file doesn't exist or not generated yet
        if (!skipDescriptionTranslation) {
            tDesc = await translateText(listing.description, lang);
        }
    }

    return {
        id: listing.id,
        slug: generateSlug(listing.name, listing.id),
        name: listing.name, // Titles should always remain in their original English form
        description: tDesc || listing.description,
        city: listing.city,
        publicAddress: listing.publicAddress,
        price: listing.price,
        cleaningFee: listing.cleaningFee,
        rating: listing.averageReviewRating,
        personCapacity: listing.personCapacity,
        bedroomsNumber: listing.bedroomsNumber,
        bathroomsNumber: listing.bathroomsNumber,
        bedsNumber: listing.bedsNumber,
        petsAllowed: listing.maxPetsAllowed !== null && listing.maxPetsAllowed > 0,
        lat: listing.lat,
        lng: listing.lng,
        checkInTimeStart: listing.checkInTimeStart,
        checkInTimeEnd: listing.checkInTimeEnd,
        checkOutTime: listing.checkOutTime,
        minNights: listing.minNights,
        currencyCode: listing.currencyCode,
        amenityIds: listing.listingAmenities?.map((a) => a.amenityId) ?? [],
        images:
            listing.listingImages
                ?.sort((a, b) => a.sortOrder - b.sortOrder)
                .map((img) => ({ url: img.url, caption: img.caption })) ?? [],
    };
}

// ─── Public API Methods ─────────────────────────────────────

/**
 * Fetch all listings (cached on the API route level)
 */
export async function getListings(lang: string = 'en'): Promise<PropertyListing[]> {
    const listings = await hostawayFetch<HostawayListing[]>('/listings');
    return await Promise.all(listings.map((l) => sanitizeListing(l, lang, true)));
}

/**
 * Fetch a single listing by ID
 */
export async function getListing(
    listingId: number,
    lang: string = 'en'
): Promise<PropertyListing | null> {
    try {
        const listing = await hostawayFetch<HostawayListing>(
            `/listings/${listingId}`
        );
        return await sanitizeListing(listing, lang);
    } catch {
        return null;
    }
}

/**
 * Find a listing by its slug
 */
export async function getListingBySlug(
    slug: string,
    lang: string = 'en'
): Promise<PropertyListing | null> {
    const listings = await hostawayFetch<HostawayListing[]>('/listings');
    const matched = listings.find((l) => generateSlug(l.name, l.id) === slug);
    if (!matched) return null;

    const sanitized = await sanitizeListing(matched, lang, false);

    // Fetch dynamic min price from PriceLabs to match the search page
    const minPrice = await getMinNightlyPrice(matched.id);
    if (minPrice !== null) {
        sanitized.price = minPrice;
    }

    return sanitized;
}

/**
 * Get the minimum nightly price from PriceLabs calendar (next 90 days)
 */
export async function getMinNightlyPrice(listingId: number): Promise<number | null> {
    try {
        const today = new Date();
        const future = new Date();
        future.setDate(today.getDate() + 90);

        const startDate = today.toISOString().split('T')[0];
        const endDate = future.toISOString().split('T')[0];

        const days = await hostawayFetch<HostawayCalendarDay[]>(
            `/listings/${listingId}/calendar?startDate=${startDate}&endDate=${endDate}`
        );

        // Find the minimum price among available dates
        const availablePrices = days
            .filter((d) => d.isAvailable === 1 && d.status === 'available' && d.price > 0)
            .map((d) => d.price);

        return availablePrices.length > 0 ? Math.min(...availablePrices) : null;
    } catch {
        return null;
    }
}

/**
 * Fetch all listings enriched with PriceLabs minimum pricing
 */
export async function getListingsWithPricing(lang: string = 'en'): Promise<PropertyListing[]> {
    const listings = await getListings(lang);

    // Batch-fetch min prices for all listings in parallel
    const priceResults = await Promise.allSettled(
        listings.map((listing) => getMinNightlyPrice(listing.id))
    );

    return listings.map((listing, i) => {
        const result = priceResults[i];
        const minPrice = result.status === 'fulfilled' && result.value !== null
            ? result.value
            : listing.price; // fallback to static base price

        return { ...listing, price: minPrice };
    });
}

/**
 * Get calendar availability for a listing within a date range
 */
export async function getCalendar(
    listingId: number,
    startDate: string,
    endDate: string
): Promise<AvailabilityResult> {
    const days = await hostawayFetch<HostawayCalendarDay[]>(
        `/listings/${listingId}/calendar?startDate=${startDate}&endDate=${endDate}`
    );

    const available = days.every(
        (day) => day.isAvailable === 1 && day.status === 'available'
    );

    return {
        listingId,
        available,
        dates: days.map((day) => ({
            date: day.date,
            available: day.isAvailable === 1 && day.status === 'available',
            price: day.price,
            minimumStay: day.minimumStay,
        })),
    };
}

/**
 * Check which listings are available for given dates
 */
export async function getAvailableListings(
    startDate: string,
    endDate: string
): Promise<number[]> {
    const listings = await getListings();
    const availabilityChecks = await Promise.allSettled(
        listings.map((listing) => getCalendar(listing.id, startDate, endDate))
    );

    // Calculate requested stay length
    const start = new Date(startDate);
    const end = new Date(endDate);
    const requestedNights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    return availabilityChecks
        .filter(
            (result): result is PromiseFulfilledResult<AvailabilityResult> => {
                if (result.status !== 'fulfilled' || !result.value.available) return false;

                // Check minimumStay from the check-in date
                const checkInDay = result.value.dates[0];
                if (checkInDay && checkInDay.minimumStay > 0 && requestedNights < checkInDay.minimumStay) {
                    return false; // Stay is too short for this listing on these dates
                }

                return true;
            }
        )
        .map((result) => result.value.listingId);
}

/**
 * Calculate price for a listing and date range
 */
export async function calculatePrice(
    listingId: number,
    startDate: string,
    endDate: string,
    guests: number,
    couponId?: number
): Promise<PricingResult> {
    const body: Record<string, unknown> = {
        startingDate: startDate,
        endingDate: endDate,
        numberOfGuests: guests.toString(),
        version: 2,
    };

    if (couponId) {
        body.reservationCouponId = couponId;
    }

    const priceData = await hostawayFetch<HostawayPriceDetails>(
        `/listings/${listingId}/calendar/priceDetails`,
        {
            method: 'POST',
            body: JSON.stringify(body),
        }
    );

    // Calculate nights from dates (API doesn't reliably return nights)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    // Parse components by their `type` field (accommodation, fee, tax, discount)
    const breakdown: { label: string; amount: number }[] = [];
    let accommodationTotal = 0;
    let cleaningFee = 0;
    let extraPersonFee = 0;
    let taxes = 0;
    let couponDiscount = 0;
    let lengthDiscount = 0;
    let lengthDiscountLabel = '';

    if (priceData.components) {
        for (const comp of priceData.components) {
            breakdown.push({ label: comp.title || comp.name, amount: comp.value });

            if (comp.type === 'accommodation') {
                accommodationTotal += comp.value;
            } else if (comp.type === 'fee') {
                const feeName = comp.name.toLowerCase();
                if (feeName.includes('clean')) {
                    cleaningFee = comp.value;
                } else if (feeName.includes('extra') || feeName.includes('person') || feeName.includes('guest')) {
                    extraPersonFee += comp.value;
                }
            } else if (comp.type === 'tax') {
                taxes += comp.value;
            } else if (comp.type === 'discount') {
                // Length-of-stay discounts (weekly, monthly) from Hostaway
                const discountName = comp.name.toLowerCase();
                if (discountName.includes('weekly') || discountName.includes('monthly')) {
                    lengthDiscount += Math.abs(comp.value);
                    lengthDiscountLabel = comp.title || comp.name; // e.g. "Weekly discount"
                } else if (discountName.includes('coupon')) {
                    couponDiscount += Math.abs(comp.value);
                } else {
                    // Unknown discount type — show as length discount
                    lengthDiscount += Math.abs(comp.value);
                    lengthDiscountLabel = comp.title || comp.name;
                }
            }
        }
    }

    // Derive nightly rate from accommodation total or fallback
    const totalDiscounts = couponDiscount + lengthDiscount;
    const nightlyRate = accommodationTotal > 0
        ? accommodationTotal / nights
        : (priceData.totalPrice - cleaningFee - taxes + totalDiscounts) / nights;

    return {
        listingId,
        nights,
        nightlyRate,
        cleaningFee,
        extraPersonFee,
        taxes,
        subtotal: accommodationTotal + cleaningFee + extraPersonFee,
        couponDiscount,
        lengthDiscount,
        lengthDiscountLabel,
        total: priceData.totalPrice,
        currency: 'EUR',
        breakdown,
    };
}

/**
 * Validate a coupon code and return the coupon if valid
 */
export async function validateCoupon(
    couponCode: string
): Promise<HostawayCoupon | null> {
    try {
        const coupons = await hostawayFetch<HostawayCoupon[]>('/coupons');
        const coupon = coupons.find(
            (c) =>
                c.name.toLowerCase() === couponCode.toLowerCase() &&
                c.isActive === 1 &&
                c.isExpired === 0
        );
        return coupon ?? null;
    } catch {
        return null;
    }
}

/**
 * Create a booking inquiry (reservation with status 'new')
 */
export async function createBookingInquiry(
    inquiry: BookingInquiry,
    totalPrice: number,
    currency: string
): Promise<BookingConfirmation> {
    try {
        const reservationData = {
            channelId: 2000, // Direct booking
            listingMapId: inquiry.listingId,
            isManuallyChecked: 0,
            isInitial: 0,
            guestName: `${inquiry.guestFirstName} ${inquiry.guestLastName}`,
            guestFirstName: inquiry.guestFirstName,
            guestLastName: inquiry.guestLastName,
            guestEmail: inquiry.guestEmail,
            numberOfGuests: inquiry.guests,
            adults: inquiry.adults,
            children: inquiry.children || null,
            arrivalDate: inquiry.checkIn,
            departureDate: inquiry.checkOut,
            phone: inquiry.guestPhone,
            totalPrice,
            currency,
            status: 'inquiry',
            guestNote: inquiry.specialRequests || null,
        };

        const reservation = await hostawayFetch<HostawayReservation>(
            '/reservations',
            {
                method: 'POST',
                body: JSON.stringify(reservationData),
            }
        );

        return {
            success: true,
            reservationId: reservation.reservationId || `HV-${reservation.id}`,
            message: 'Your booking request has been submitted successfully.',
        };
    } catch (error) {
        return {
            success: false,
            reservationId: '',
            message:
                error instanceof Error
                    ? error.message
                    : 'Failed to submit booking request. Please try again.',
        };
    }
}

/**
 * Get reviews for a listing (guest-to-host only, with public review text)
 */
export async function getReviews(
    listingId: number,
    lang: string = 'en'
): Promise<HostawayReview[]> {
    try {
        let allReviews: HostawayReview[] = [];
        let offset = 0;
        const limit = 500;

        // Loop to fetch all reviews since Hostaway's API ignores listingMapId filtering
        while (offset < 5000) { // Safety break at 5000 reviews
            const batch = await hostawayFetch<HostawayReview[]>(
                `/reviews?limit=${limit}&offset=${offset}`
            );
            if (!batch || batch.length === 0) break;

            allReviews.push(...batch);
            if (batch.length < limit) break; // Reached the end
            offset += limit;
        }

        const filtered = allReviews.filter(
            (r) => r.listingMapId === listingId && r.type === 'guest-to-host'
        );

        if (lang === 'en' || !filtered.length) {
            return filtered;
        }

        // Batch translate using a unique separator
        const separator = '\n\n|||\n\n';
        const textToTranslate = filtered.map(r => r.publicReview || '').join(separator);
        const translatedText = await translateText(textToTranslate, lang);

        // Google translate might add spaces around the separator
        const translatedChunks = translatedText.split(/\s*\|\|\|\s*/);

        return filtered.map((r, i) => {
            const translatedReview = translatedChunks[i]?.trim();
            return {
                ...r,
                originalReview: r.publicReview,
                publicReview: translatedReview || r.publicReview
            };
        });
    } catch {
        return [];
    }
}

/**
 * Get the master amenity list (name mappings)
 */
export async function getAmenities(lang: string = 'en'): Promise<HostawayAmenity[]> {
    try {
        const amenities = await hostawayFetch<HostawayAmenity[]>('/amenities');

        if (lang === 'en' || !amenities.length) {
            return amenities;
        }

        // Try to load pre-calculated static map for amenities
        let translations: Record<string, string> = {};
        try {
            if (lang === 'el') {
                translations = (await import('@/translations/amenities-el.json')).default;
            } else if (lang === 'ru') {
                translations = (await import('@/translations/amenities-ru.json')).default;
            }
        } catch (e) {
            console.warn(`Could not load amenity translations for lang: ${lang}`);
        }

        return amenities.map((a) => {
            return {
                ...a,
                name: (a.name && translations[a.name]) ? translations[a.name] : a.name
            };
        });
    } catch {
        return [];
    }
}
