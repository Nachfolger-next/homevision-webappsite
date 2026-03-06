import { MetadataRoute } from 'next';
import { i18n } from '../i18n-config';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://homevision.gr';

    // Core routes that exist across all languages
    const routes = [
        '',
        '/about',
        '/services',
        '/digital',
        '/management',
        '/portfolio',
        '/contact',
        '/privacy',
        '/terms',
    ];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Add all localized routes
    for (const locale of i18n.locales) {
        for (const route of routes) {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: route === '' || route === '/portfolio' ? 'weekly' : 'monthly',
                priority: route === '' ? 1 : 0.8,
            });
        }

        // Add Journal specifically (mostly targeted for el, but generated for all)
        sitemapEntries.push({
            url: `${baseUrl}/${locale}/journal`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        });
    }

    // Default top-level redirect entries
    for (const route of routes) {
        sitemapEntries.push({
            url: `${baseUrl}${route}`,
            lastModified: new Date(),
            changeFrequency: route === '' || route === '/portfolio' ? 'weekly' : 'monthly',
            priority: route === '' ? 1 : 0.8,
        });
    }

    return sitemapEntries;
}
