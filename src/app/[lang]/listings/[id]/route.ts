import { NextRequest, NextResponse } from 'next/server';
import { getListing } from '@/lib/hostaway';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ lang: string; id: string }> }
) {
    const { lang, id } = await props.params;

    // 1. Check if ID is a numeric Hostaway Listing ID
    const listingId = parseInt(id, 10);

    if (!isNaN(listingId)) {
        try {
            const property = await getListing(listingId, lang);
            if (property && property.slug) {
                // Redirect to the beautiful, localized custom property details page
                return NextResponse.redirect(
                    new URL(`/${lang}/properties/${property.slug}`, request.url),
                    307
                );
            }
        } catch (error) {
            console.error('Error fetching listing by ID for redirect:', error);
        }
    }

    // 2. Fallback: If it's not a number or the lookup failed, treat it as a slug.
    // Hostaway templates sometimes use slug names directly.
    return NextResponse.redirect(
        new URL(`/${lang}/properties/${id}`, request.url),
        307
    );
}
