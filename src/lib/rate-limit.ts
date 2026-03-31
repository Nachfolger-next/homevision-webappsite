import { NextResponse } from 'next/server';

// Simple in-memory rate limiter for serverless
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // max 5 requests per minute per IP

export function rateLimit(ip: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    // Clean up old entries periodically (every 100 checks)
    if (Math.random() < 0.01) {
        for (const [key, val] of rateLimitMap) {
            if (now > val.resetTime) rateLimitMap.delete(key);
        }
    }

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return { allowed: true, remaining: MAX_REQUESTS - 1 };
    }

    if (entry.count >= MAX_REQUESTS) {
        return { allowed: false, remaining: 0 };
    }

    entry.count++;
    return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}

export function rateLimitResponse() {
    return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
    );
}

export function getClientIp(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    const realIp = request.headers.get('x-real-ip');
    if (realIp) return realIp;
    return 'unknown';
}
