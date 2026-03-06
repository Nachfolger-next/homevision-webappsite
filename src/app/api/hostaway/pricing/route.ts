import { NextRequest, NextResponse } from 'next/server';
import { calculatePrice, validateCoupon } from '@/lib/hostaway';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { listingId, startDate, endDate, guests, couponCode } = body;

        if (!listingId || !startDate || !endDate || !guests) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'listingId, startDate, endDate, and guests are required',
                },
                { status: 400 }
            );
        }

        // Validate coupon if provided
        let couponId: number | undefined;
        let couponInfo = null;

        if (couponCode) {
            const coupon = await validateCoupon(couponCode);
            if (coupon) {
                couponId = coupon.id;
                couponInfo = {
                    name: coupon.name,
                    type: coupon.type,
                    amount: coupon.amount,
                };
            } else {
                return NextResponse.json(
                    { success: false, error: 'Invalid or expired coupon code' },
                    { status: 400 }
                );
            }
        }

        const pricing = await calculatePrice(
            parseInt(listingId, 10),
            startDate,
            endDate,
            parseInt(guests, 10),
            couponId
        );

        return NextResponse.json({
            success: true,
            data: { ...pricing, coupon: couponInfo },
        });
    } catch (error) {
        console.error('Error calculating price:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to calculate price' },
            { status: 500 }
        );
    }
}
