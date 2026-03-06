import { Locale } from '@/i18n-config';
import type { Metadata } from 'next';
import { getAlternates } from '@/lib/metadata';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
    title: 'Services & Pricing | Homevision',
    description: 'Explore our full-service property management and digital-only packages designed for premium short-term rentals in Greece.',
    openGraph: {
        title: 'Homevision Services & Pricing',
        description: 'Choose between complete hands-off management or strategic digital guidance.',
        type: 'website',
    },
    alternates: getAlternates('/services'),
};

export default async function ServicesPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;

    return <ServicesClient lang={lang} />;
}
