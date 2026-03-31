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

import { getDictionary } from '@/lib/get-dictionary';

export default async function ServicesPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const faqs = (dict.services as any)?.faqs || [];

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq: { q: string; a: string }) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
            },
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <ServicesClient lang={lang} dict={dict} />
        </>
    );
}
