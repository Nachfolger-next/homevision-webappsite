import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ lang: string }> }
) {
    const { lang } = await props.params;

    // Preserve any search parameters (check-in, check-out, guests) to maintain user intent
    const searchParams = request.nextUrl.searchParams.toString();
    const destUrl = `/${lang}/properties${searchParams ? `?${searchParams}` : ''}`;

    return NextResponse.redirect(new URL(destUrl, request.url));
}
