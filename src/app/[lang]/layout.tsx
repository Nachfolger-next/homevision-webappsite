import type { Metadata } from 'next';
import { Manrope, Cormorant_Garamond, Noto_Sans_Hebrew, Source_Serif_4 } from 'next/font/google';
import '../globals.css';
import { i18n } from '../../i18n-config';
import GoogleAnalytics from '@/components/GoogleAnalytics';

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
  return (
    <html lang={lang} dir={dir} className={`${manrope.variable} ${cormorant.variable} ${sourceSerif.variable} ${notoHebrew.variable}`}>
      <body className={manrope.className}>
        <GoogleAnalytics />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}


