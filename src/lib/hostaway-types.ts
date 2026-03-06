// ============================================================
// Hostaway API TypeScript Interfaces
// Docs: https://api.hostaway.com/documentation
// ============================================================

// --- Listing ---

export interface HostawayListingImage {
    id: number;
    caption: string | null;
    url: string;
    sortOrder: number;
}

export interface HostawayListingAmenity {
    id: number;
    amenityId: number;
}

export interface HostawayListingBedType {
    id: number;
    bedTypeId: number;
    quantity: number;
}

export interface HostawayListing {
    id: number;
    propertyTypeId: number;
    name: string;
    externalListingName: string;
    internalListingName: string;
    description: string;
    houseRules: string | null;
    country: string;
    countryCode: string;
    state: string;
    city: string;
    street: string;
    address: string;
    publicAddress: string;
    zipcode: string;
    price: number;
    averageReviewRating: number | null;
    weeklyDiscount: number;
    monthlyDiscount: number;
    cleaningFee: number;
    personCapacity: number;
    maxPetsAllowed: number | null;
    lat: number;
    lng: number;
    checkInTimeStart: number;
    checkInTimeEnd: number;
    checkOutTime: number;
    squareMeters: number | null;
    roomType: string;
    bedroomsNumber: number;
    bedsNumber: number;
    bathroomsNumber: number;
    minNights: number;
    maxNights: number;
    guestsIncluded: number;
    priceForExtraPerson: number;
    instantBookable: number;
    currencyCode: string;
    timeZoneName: string;
    wifiUsername: string | null;
    wifiPassword: string | null;
    listingAmenities: HostawayListingAmenity[];
    listingBedTypes: HostawayListingBedType[];
    listingImages: HostawayListingImage[];
}

// --- Calendar ---

export type CalendarDayStatus =
    | 'available'
    | 'blocked'
    | 'mblocked'
    | 'hardBlock'
    | 'conflicted'
    | 'reserved'
    | 'pending'
    | 'mreserved';

export interface HostawayCalendarDay {
    id: number;
    date: string; // YYYY-MM-DD
    isAvailable: 0 | 1;
    isProcessed: 0 | 1;
    status: CalendarDayStatus;
    price: number;
    minimumStay: number;
    maximumStay: number;
    closedOnArrival: number | null;
    closedOnDeparture: number | null;
    note: string | null;
}

// --- Price Calculation ---

export interface HostawayPriceComponent {
    name: string;
    title: string;
    type: string; // 'accommodation' | 'fee' | 'tax'
    value: number;
    total: number;
    isIncludedInTotalPrice: number;
    units: number;
}

export interface HostawayPriceDetails {
    nights?: number;
    totalPrice: number;
    components: HostawayPriceComponent[];
}

// --- Reservation ---

export interface HostawayReservationCreate {
    channelId: 2000; // Direct booking
    listingMapId: number;
    guestName: string;
    guestFirstName: string;
    guestLastName: string;
    guestEmail: string;
    numberOfGuests: number;
    adults: number;
    children: number | null;
    infants: number | null;
    pets: number | null;
    arrivalDate: string; // YYYY-MM-DD
    departureDate: string; // YYYY-MM-DD
    phone: string;
    totalPrice: number;
    currency: string;
    status: 'new';
    hostNote: string | null;
    guestNote: string | null;
}

export interface HostawayReservation extends HostawayReservationCreate {
    id: number;
    reservationId: string;
    reservationDate: string;
    isPaid: number | null;
}

// --- Coupon ---

export type CouponType = 'percentage' | 'flatFee';

export interface HostawayCoupon {
    id: number;
    accountId: number;
    isActive: 0 | 1;
    isExpired: 0 | 1;
    name: string;
    type: CouponType;
    amount: number;
    minimumNights: number;
    checkInDateStart: string | null;
    checkInDateEnd: string | null;
    numberOfUsesInitial: number;
    numberOfUsesUsed: number;
    validityDateStart: string | null;
    validityDateEnd: string | null;
}

// --- Review ---

export interface HostawayReview {
    id: number;
    listingMapId: number;
    reservationId: number;
    channelId: number;
    type: 'guest-to-host' | 'host-to-guest';
    status: string;
    rating: number | null;
    publicReview: string | null;
    originalReview?: string | null;
    privateFeedback: string | null;
    revieweeResponse: string | null;
    departureDate: string;
    arrivalDate: string;
    listingName: string;
    guestName: string;
}

// --- Amenity ---

export interface HostawayAmenity {
    id: number;
    name: string;
}

// --- API Response ---

export interface HostawayApiResponse<T> {
    status: string;
    result: T;
    count?: number;
}

// --- Public-facing (sanitized) types ---

export interface PropertyListing {
    id: number;
    slug: string;
    name: string;
    description: string;
    city: string;
    publicAddress: string;
    price: number;
    cleaningFee: number;
    rating: number | null;
    personCapacity: number;
    bedroomsNumber: number;
    bathroomsNumber: number;
    bedsNumber: number;
    petsAllowed: boolean;
    lat: number;
    lng: number;
    checkInTimeStart: number;
    checkInTimeEnd: number;
    checkOutTime: number;
    minNights: number;
    currencyCode: string;
    amenityIds: number[];
    images: { url: string; caption: string | null }[];
}

export interface AvailabilityResult {
    listingId: number;
    available: boolean;
    dates: {
        date: string;
        available: boolean;
        price: number;
        minimumStay: number;
    }[];
}

export interface PricingResult {
    listingId: number;
    nights: number;
    nightlyRate: number;
    cleaningFee: number;
    extraPersonFee: number;
    taxes: number;
    subtotal: number;
    couponDiscount: number;
    lengthDiscount: number;
    lengthDiscountLabel: string;
    total: number;
    currency: string;
    breakdown: { label: string; amount: number }[];
}

export interface BookingInquiry {
    listingId: number;
    checkIn: string;
    checkOut: string;
    guests: number;
    adults: number;
    children: number;
    guestFirstName: string;
    guestLastName: string;
    guestEmail: string;
    guestPhone: string;
    specialRequests: string;
    couponCode?: string;
}

export interface BookingConfirmation {
    success: boolean;
    reservationId: string;
    message: string;
}
