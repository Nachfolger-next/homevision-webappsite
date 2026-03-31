'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function hasConsent(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('cookie-consent') === 'accepted';
}

export default function GoogleAnalytics() {
    const [consentGiven, setConsentGiven] = useState(false);

    useEffect(() => {
        // Check initial consent
        setConsentGiven(hasConsent());

        // Listen for consent changes from CookieConsent component
        const handleConsentChange = () => {
            setConsentGiven(hasConsent());
        };

        window.addEventListener('cookie-consent-change', handleConsentChange);
        return () => window.removeEventListener('cookie-consent-change', handleConsentChange);
    }, []);

    if (!GA_MEASUREMENT_ID || !consentGiven) return null;

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_MEASUREMENT_ID}', {
                            page_path: window.location.pathname,
                        });
                    `,
                }}
            />
        </>
    );
}

// Helper to track custom events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
}
