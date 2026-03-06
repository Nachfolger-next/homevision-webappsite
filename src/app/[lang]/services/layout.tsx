import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Services & Pricing | Homevision',
    description: 'Compare Full Management (20%) and Digital Management (12%) plans. Professional cleaning, dynamic pricing, 24/7 guest communication, and more.',
    openGraph: {
        title: 'Services & Pricing | Homevision',
        description: 'Two tiers of service, one goal: maximizing your property\'s potential.',
        type: 'website',
    },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
