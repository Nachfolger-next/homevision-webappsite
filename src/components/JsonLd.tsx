export default function JsonLd() {
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': 'https://homevision.gr',
        name: 'Homevision',
        legalName: 'Homevision IKE',
        description: 'Premium short-term rental property management in Greece. Full-service management for Thessaloniki, Chalkidiki, Athens, and the Greek Islands.',
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
        sameAs: [
            'https://www.instagram.com/homevision.gr/',
        ],
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00',
        },
        priceRange: '€€',
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            bestRating: '5',
            ratingCount: '150',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
    );
}
