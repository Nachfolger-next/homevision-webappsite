import { Metadata } from 'next';
import { getAlternates } from '@/lib/metadata';
import PropertiesClient from '@/components/booking/PropertiesClient';
import type { Locale } from '@/i18n-config';

export const metadata: Metadata = {
    title: 'Properties | Book Direct',
    description:
        'Browse and book premium vacation rentals in Thessaloniki, Chalkidiki, Athens, and the Greek Islands. Best rate guaranteed — book direct with Homevision.',
    alternates: getAlternates('/properties'),
};

export default async function PropertiesPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    return <PropertiesClient lang={lang as Locale} />;
}
