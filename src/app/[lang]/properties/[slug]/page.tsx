import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PropertyDetailClient from '@/components/booking/PropertyDetailClient';
import { getListingBySlug, getListings, getAmenities } from '@/lib/hostaway';
import { getDictionary } from '@/lib/get-dictionary';
import { getAlternates } from '@/lib/metadata';
import type { Locale } from '@/i18n-config';

// Generate static params for all property slugs
export async function generateStaticParams() {
    try {
        const listings = await getListings();
        return listings.map((listing) => ({
            slug: listing.slug,
        }));
    } catch {
        return [];
    }
}

// Dynamic SEO metadata
export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
    const { slug, lang } = await params;
    const property = await getListingBySlug(slug, lang);

    if (!property) {
        return {
            title: 'Property Not Found',
        };
    }

    return {
        title: `${property.name} | Book Direct`,
        description: property.description?.slice(0, 160) || `Book ${property.name} in ${property.city}. ${property.bedroomsNumber} bedrooms, sleeps ${property.personCapacity}. Best rate guaranteed.`,
        openGraph: {
            title: property.name,
            description: property.description?.slice(0, 160),
            images: property.images[0]?.url ? [property.images[0].url] : [],
        },
        alternates: getAlternates(`/properties/${slug}`),
    };
}

export default async function PropertyPage({
    params,
}: {
    params: Promise<{ lang: string; slug: string }>;
}) {
    const { lang, slug } = await params;
    const [property, amenities, englishAmenities, dict] = await Promise.all([
        getListingBySlug(slug, lang),
        getAmenities(lang),
        lang === 'en' ? getAmenities('en') : getAmenities('en'),
        getDictionary(lang as Locale),
    ]);

    if (!property) {
        notFound();
    }

    // Build a simple id → name map for the client component
    const amenityMap: Record<number, string> = {};
    for (const a of amenities) {
        amenityMap[a.id] = a.name;
    }

    const englishAmenityMap: Record<number, string> = {};
    for (const a of englishAmenities) {
        englishAmenityMap[a.id] = a.name;
    }

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'VacationRental',
                        name: property.name,
                        description: property.description,
                        image: property.images.map((img) => img.url),
                        address: {
                            '@type': 'PostalAddress',
                            addressLocality: property.city,
                            addressRegion: property.publicAddress,
                            addressCountry: 'GR',
                        },
                        geo: {
                            '@type': 'GeoCoordinates',
                            latitude: property.lat,
                            longitude: property.lng,
                        },
                        numberOfBedrooms: property.bedroomsNumber,
                        numberOfBathroomsTotal: property.bathroomsNumber,
                        occupancy: {
                            '@type': 'QuantitativeValue',
                            maxValue: property.personCapacity,
                        },
                        petsAllowed: property.petsAllowed,
                        checkinTime: `${property.checkInTimeStart}:00`,
                        checkoutTime: `${property.checkOutTime}:00`,
                        ...(property.rating && {
                            aggregateRating: {
                                '@type': 'AggregateRating',
                                ratingValue: property.rating,
                                bestRating: 10,
                            },
                        }),
                        priceRange: `€${property.price}`,
                    }),
                }}
            />
            <Suspense>
                <PropertyDetailClient property={property} lang={lang as Locale} amenityMap={amenityMap} englishAmenityMap={englishAmenityMap} dict={dict} />
            </Suspense>
        </>
    );
}
