import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Invalid email address'),
    phone: z.string().max(50).optional(),
    message: z.string().max(2000).optional(),
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
        const resend = new Resend(process.env.RESEND_API_KEY || 'missing_key_during_build');

        const body = await request.json();

        // Validate input
        const validatedData = contactSchema.parse(body);
        const { name, email, phone, message } = validatedData;

        const notificationEmail = process.env.LEAD_NOTIFICATION_EMAIL || 'info@homevision.gr';

        // Escape HTML to prevent XSS
        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safePhone = escapeHtml(phone || '');
        const safeMessage = escapeHtml(message || '');

        const html = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #447d9c; color: white; padding: 24px 32px; border-radius: 12px 12px 0 0;">
                    <h1 style="margin: 0; font-size: 20px; font-weight: 600;">📬 New Contact Form Submission</h1>
                </div>
                <div style="background: #f9f9f9; padding: 32px; border-radius: 0 0 12px 12px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 600; color: #333; width: 120px;">Name</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #555;">${safeName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 600; color: #333;">Email</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #555;">
                                <a href="mailto:${safeEmail}" style="color: #447d9c;">${safeEmail}</a>
                            </td>
                        </tr>
                        ${safePhone ? `
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 600; color: #333;">Phone</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #555;">
                                <a href="tel:${safePhone}" style="color: #447d9c;">${safePhone}</a>
                            </td>
                        </tr>
                        ` : ''}
                        <tr>
                            <td style="padding: 12px 0; font-weight: 600; color: #333; vertical-align: top;">Message</td>
                            <td style="padding: 12px 0; color: #555; white-space: pre-wrap;">${safeMessage || '(No message)'}</td>
                        </tr>
                    </table>
                </div>
            </div>
        `;

        await resend.emails.send({
            from: 'Homevision Contact <leads@send.homevision.gr>',
            to: notificationEmail,
            subject: `Contact Form: ${safeName}`,
            html,
            replyTo: safeEmail,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
        }
        console.error('Contact form error:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
