import { type Locale } from '../../i18n-config';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import RevenueCalculator from '@/components/RevenueCalculator';
import ServiceBundles from '@/components/ServiceBundles';
import TransparencySection from '@/components/TransparencySection';
import PortfolioHighlight from '@/components/PortfolioHighlight';
import Testimonials from '@/components/Testimonials';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

import type { Metadata } from 'next';
import { getAlternates } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Homevision | Premium Property Management in Greece',
  description: 'Maximize your property revenue with complete peace of mind. Premium property management, dynamic pricing, and fully transparent operations.',
  openGraph: {
    title: 'Homevision | Premium Property Management',
    description: 'Maximize your property revenue with complete peace of mind.',
    type: 'website',
  },
  alternates: getAlternates(''),
};

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Header lang={lang} theme="dark" />
      <Hero lang={lang} />
      <TrustBar lang={lang} />
      <RevenueCalculator lang={lang} />
      <ServiceBundles lang={lang} />
      <TransparencySection lang={lang} />
      <PortfolioHighlight lang={lang} />
      <Testimonials lang={lang} />
      <CallToAction lang={lang} />
      <Footer lang={lang} />
    </main>
  );
}
