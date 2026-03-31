import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { rateLimit, rateLimitResponse, getClientIp } from '@/lib/rate-limit';

const newsletterSchema = z.object({
    email: z.string().email('Invalid email address'),
});

const escapeHtml = (unsafe: string) => {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

export async function POST(request: Request) {
    try {
        // Rate limiting
        const ip = getClientIp(request);
        const { allowed } = rateLimit(ip);
        if (!allowed) return rateLimitResponse();

        const body = await request.json();
        const { email } = newsletterSchema.parse(body);
        const safeEmail = escapeHtml(email);

        const resend = new Resend(process.env.RESEND_API_KEY || 'missing_key_during_build');
        const toEmail = process.env.LEAD_NOTIFICATION_EMAIL || 'info@homevision.gr';

        // Notify the team about the new subscriber
        const { error } = await resend.emails.send({
            from: 'HomeVision <noreply@send.homevision.gr>',
            to: [toEmail],
            subject: `📬 New Newsletter Subscriber: ${safeEmail}`,
            html: `
                <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px;">
                    <h2 style="color: #447d9c; margin: 0 0 16px; font-size: 18px;">New Newsletter Subscriber</h2>
                    <p style="font-size: 15px; margin: 0 0 8px;">
                        <strong>${safeEmail}</strong> has subscribed to your newsletter.
                    </p>
                    <p style="font-size: 12px; color: #888; margin-top: 24px;">
                        Add this email to your mailing list.
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error('Newsletter notification error:', error);
            return NextResponse.json({ error: 'Failed to process subscription' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
        }
        console.error('Newsletter API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
