import { NextRequest, NextResponse } from 'next/server';
import { getReviews } from '@/lib/hostaway';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');

    if (!listingId) {
        return NextResponse.json(
            { success: false, error: 'listingId is required' },
            { status: 400 }
        );
    }

    const lang = searchParams.get('lang') || 'en';

    try {
        const reviews = await getReviews(parseInt(listingId, 10), lang);
        return NextResponse.json({ success: true, data: reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}
