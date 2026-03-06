import { NextRequest, NextResponse } from 'next/server';
import { getListingsWithPricing } from '@/lib/hostaway';

export const revalidate = 3600; // Cache for 1 hour (ISR)

export async function GET(request: NextRequest) {
    try {
        const lang = request.nextUrl.searchParams.get('lang') || 'en';
        const listings = await getListingsWithPricing(lang);
        return NextResponse.json({ success: true, data: listings });
    } catch (error) {
        console.error('Error fetching listings:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch listings' },
            { status: 500 }
        );
    }
}
