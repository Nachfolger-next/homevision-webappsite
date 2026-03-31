import { NextRequest, NextResponse } from 'next/server';
import { createBookingInquiry } from '@/lib/hostaway';
import type { BookingInquiry } from '@/lib/hostaway-types';
import { z } from 'zod';

const bookingSchema = z.object({
    listingId: z.union([z.string(), z.number()]).transform((val) => parseInt(String(val), 10)),
    checkIn: z.string().min(10), // e.g. YYYY-MM-DD
    checkOut: z.string().min(10),
    guests: z.union([z.string(), z.number()]).transform((val) => parseInt(String(val), 10)),
    adults: z.union([z.string(), z.number()]).optional().transform((val) => val ? parseInt(String(val), 10) : undefined),
    children: z.union([z.string(), z.number()]).optional().transform((val) => val ? parseInt(String(val), 10) : 0),
    guestFirstName: z.string().min(1, 'First name is required'),
    guestLastName: z.string().min(1, 'Last name is required'),
    guestEmail: z.string().email('Invalid email address'),
    guestPhone: z.string().min(5, 'Phone number is required'),
    specialRequests: z.string().optional(),
    totalPrice: z.union([z.string(), z.number()]).optional().transform((val) => val ? parseFloat(String(val)) : 0),
    currency: z.string().optional().default('EUR'),
    couponCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        let validatedData;
        try {
            validatedData = bookingSchema.parse(body);
        } catch (validationError: any) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: validationError.errors },
                { status: 400 }
            );
        }

        const inquiry: BookingInquiry = {
            listingId: validatedData.listingId,
            checkIn: validatedData.checkIn,
            checkOut: validatedData.checkOut,
            guests: validatedData.guests,
            adults: validatedData.adults || validatedData.guests,
            children: validatedData.children || 0,
            guestFirstName: validatedData.guestFirstName,
            guestLastName: validatedData.guestLastName,
            guestEmail: validatedData.guestEmail,
            guestPhone: validatedData.guestPhone,
            specialRequests: validatedData.specialRequests || '',
            couponCode: validatedData.couponCode,
        };

        const result = await createBookingInquiry(
            inquiry,
            validatedData.totalPrice,
            validatedData.currency
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
