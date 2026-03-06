import { NextRequest, NextResponse } from 'next/server';
import { getAvailableListings, getCalendar } from '@/lib/hostaway';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const listingId = searchParams.get('listingId');

    if (!startDate || !endDate) {
        return NextResponse.json(
            { success: false, error: 'startDate and endDate are required' },
            { status: 400 }
        );
    }

    try {
        // If a specific listing is requested, return its calendar
        if (listingId) {
            const calendar = await getCalendar(
                parseInt(listingId, 10),
                startDate,
                endDate
            );
            return NextResponse.json({ success: true, data: calendar });
        }

        // Otherwise, return all available listing IDs for the date range
        const availableIds = await getAvailableListings(startDate, endDate);
        return NextResponse.json({ success: true, data: availableIds });
    } catch (error) {
        console.error('Error checking availability:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to check availability' },
            { status: 500 }
        );
    }
}
