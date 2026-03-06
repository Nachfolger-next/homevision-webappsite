import { type Locale } from '@/i18n-config';
import type { Metadata } from 'next';
import { getAlternates } from '@/lib/metadata';
import DigitalPageContent from '@/components/DigitalPageContent';

export const metadata: Metadata = {
    title: 'Digital Property Management | Homevision',
    description: 'Remote property management with dynamic pricing, 24/7 guest communication, booking management, and performance reporting — at just 12% commission.',
    openGraph: {
        title: 'Digital Property Management | Homevision',
        description: 'For owners who want to save time on guest messaging and stress-free operations.',
        type: 'website',
    },
    alternates: getAlternates('/digital'),
};

export default async function DigitalPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    return <DigitalPageContent lang={lang} />;
}
