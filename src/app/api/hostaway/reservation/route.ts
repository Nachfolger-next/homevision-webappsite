import { NextRequest, NextResponse } from 'next/server';
import { createBookingInquiry } from '@/lib/hostaway';
import type { BookingInquiry } from '@/lib/hostaway-types';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            listingId,
            checkIn,
            checkOut,
            guests,
            adults,
            children,
            guestFirstName,
            guestLastName,
            guestEmail,
            guestPhone,
            specialRequests,
            totalPrice,
            currency,
            couponCode,
        } = body;

        // Validate required fields
        if (
            !listingId ||
            !checkIn ||
            !checkOut ||
            !guests ||
            !guestFirstName ||
            !guestLastName ||
            !guestEmail ||
            !guestPhone
        ) {
            return NextResponse.json(
                { success: false, error: 'Missing required booking fields' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(guestEmail)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email address' },
                { status: 400 }
            );
        }

        const inquiry: BookingInquiry = {
            listingId: parseInt(listingId, 10),
            checkIn,
            checkOut,
            guests: parseInt(guests, 10),
            adults: parseInt(adults, 10) || parseInt(guests, 10),
            children: parseInt(children, 10) || 0,
            guestFirstName,
            guestLastName,
            guestEmail,
            guestPhone,
            specialRequests: specialRequests || '',
            couponCode,
        };

        const result = await createBookingInquiry(
            inquiry,
            parseFloat(totalPrice) || 0,
            currency || 'EUR'
        );

        if (result.success) {
            return NextResponse.json({ success: true, data: result });
        } else {
            return NextResponse.json(
                { success: false, error: result.message },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error creating reservation:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to submit booking request' },
            { status: 500 }
        );
    }
}
