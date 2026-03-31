import type { Metadata } from 'next';
import { Manrope, Cormorant_Garamond, Noto_Sans_Hebrew, Source_Serif_4 } from 'next/font/google';
import '../globals.css';
import { i18n } from '../../i18n-config';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import FacebookPixel from '@/components/FacebookPixel';
import CookieConsent from '@/components/CookieConsent';

const manrope = Manrope({
  subsets: ['latin', 'greek', 'cyrillic'],
  variable: '--font-manrope',
});
const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant-garamond',
});
const sourceSerif = Source_Serif_4({
  subsets: ['latin', 'greek', 'cyrillic'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-source-serif',
});
const notoHebrew = Noto_Sans_Hebrew({
  subsets: ['hebrew'],
  variable: '--font-hebrew',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://homevision.gr'),
  title: {
    default: 'Homevision | Premium Property Management in Greece',
    template: '%s | Homevision',
  },
  description: 'Luxury short-term rental management and digital guest experiences across Thessaloniki, Chalkidiki, Athens, and the Greek Islands.',
  openGraph: {
    siteName: 'Homevision',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://homevision.gr/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Homevision — Premium Property Management in Greece',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

import SmoothScroll from '@/components/SmoothScroll';

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const dir = lang === 'he' ? 'rtl' : 'ltr';
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://homevision.gr',
    name: 'Homevision',
    legalName: 'Homevision IKE',
    description: 'Premium short-term rental property management in Greece.',
    url: 'https://homevision.gr',
    logo: 'https://homevision.gr/logo-color.png',
    image: 'https://homevision.gr/og-image.png',
    telephone: '+306949413865',
    email: 'info@homevision.gr',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Edmondou Rostan 9',
      addressLocality: 'Thessaloniki',
      postalCode: '54641',
      addressCountry: 'GR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.6264622,
      longitude: 22.9176253,
    },
    areaServed: [
      { '@type': 'City', name: 'Thessaloniki' },
      { '@type': 'AdministrativeArea', name: 'Chalkidiki' },
      { '@type': 'City', name: 'Athens' },
    ],
  };

  return (
    <html lang={lang} dir={dir} className={`${manrope.variable} ${cormorant.variable} ${sourceSerif.variable} ${notoHebrew.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      </head>
      <body className={manrope.className}>
        <GoogleAnalytics />
        <FacebookPixel />
        <SmoothScroll />
        {children}
        <CookieConsent lang={lang} />
      </body>
    </html>
  );
}


