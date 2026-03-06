import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, phone, wantsAnalysis, address, bedrooms, finish, seaView, pool, revenue } = body;

        // Validate required fields
        if (!name || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        const toEmail = process.env.LEAD_NOTIFICATION_EMAIL || 'info@homevision.gr';

        // Build a clean HTML email
        const html = `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden;">
                <div style="background: #447d9c; padding: 32px 24px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 500;">New Property Lead</h1>
                    <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 13px;">Revenue Estimator Submission</p>
                </div>
                ${wantsAnalysis ? `
                <div style="background: #f0fdf4; padding: 12px 24px; border-bottom: 1px solid #bbf7d0;">
                    <p style="margin: 0; font-size: 13px; color: #166534;">⭐ <strong>Wants a detailed analysis</strong> — prioritize this lead</p>
                </div>
                ` : ''}
                
                <div style="padding: 32px 24px;">
                    <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 16px; border: 1px solid #e5e5e5;">
                        <h2 style="margin: 0 0 12px; font-size: 14px; color: #447d9c; text-transform: uppercase; letter-spacing: 1px;">Contact</h2>
                        <p style="margin: 4px 0; font-size: 15px;"><strong>${name}</strong></p>
                        <p style="margin: 4px 0; font-size: 15px;"><a href="mailto:${email}" style="color: #447d9c;">${email}</a></p>
                        ${phone ? `<p style="margin: 4px 0; font-size: 15px;"><a href="tel:${phone}" style="color: #447d9c;">📞 ${phone}</a></p>` : ''}
                    </div>

                    <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 16px; border: 1px solid #e5e5e5;">
                        <h2 style="margin: 0 0 12px; font-size: 14px; color: #447d9c; text-transform: uppercase; letter-spacing: 1px;">Property Details</h2>
                        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 6px 0; color: #888;">Address</td>
                                <td style="padding: 6px 0; text-align: right; font-weight: 500;">${address || 'Not provided'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #888;">Bedrooms</td>
                                <td style="padding: 6px 0; text-align: right; font-weight: 500;">${bedrooms}${bedrooms === 5 ? '+' : ''}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #888;">Finish Level</td>
                                <td style="padding: 6px 0; text-align: right; font-weight: 500;">${finish}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #888;">Sea View</td>
                                <td style="padding: 6px 0; text-align: right; font-weight: 500;">${seaView ? '✅ Yes' : '❌ No'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #888;">Pool</td>
                                <td style="padding: 6px 0; text-align: right; font-weight: 500;">${pool ? '✅ Yes' : '❌ No'}</td>
                            </tr>
                        </table>
                    </div>

                    ${revenue ? `
                    <div style="background: #447d9c; border-radius: 8px; padding: 20px; text-align: center; color: white;">
                        <p style="margin: 0 0 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6;">Rough Estimate Shown</p>
                        <p style="margin: 0; font-size: 28px; font-weight: 300;">€${revenue.min?.toLocaleString()} — €${revenue.max?.toLocaleString()}/mo</p>
                    </div>
                    ` : ''}
                </div>

                <div style="padding: 16px 24px; text-align: center; border-top: 1px solid #e5e5e5;">
                    <p style="margin: 0; font-size: 11px; color: #aaa;">Sent from HomeVision Revenue Estimator</p>
                </div>
            </div>
        `;

        const { data, error } = await resend.emails.send({
            from: 'HomeVision Leads <leads@send.homevision.gr>',
            to: [toEmail],
            subject: `${wantsAnalysis ? '⭐ ' : ''}🏠 New Lead: ${name} — ${address || 'No address'}`,
            html,
            replyTo: email,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
        }

        return NextResponse.json({ success: true, id: data?.id });
    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
