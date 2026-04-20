import { MetadataRoute } from 'next';
import { i18n } from '../i18n-config';
import { getArticleSlugs } from '@/lib/journal';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

        // Add Journal index page
        sitemapEntries.push({
            url: `${baseUrl}/${locale}/journal`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        });
    }

    // Dynamic journal article pages
    try {
        const articleSlugs = getArticleSlugs();
        for (const slug of articleSlugs) {
            for (const locale of i18n.locales) {
                sitemapEntries.push({
                    url: `${baseUrl}/${locale}/journal/${slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.6,
                });
            }
        }
    } catch {
        // Journal directory might not exist yet
    }

    // Dynamic property pages — fetch listing slugs from Hostaway
    try {
        const { getListings } = await import('@/lib/hostaway');
        const listings = await getListings('en');
        for (const listing of listings) {
            for (const locale of i18n.locales) {
                sitemapEntries.push({
                    url: `${baseUrl}/${locale}/properties/${listing.slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.7,
                });
            }
        }
    } catch {
        // Hostaway API might be unavailable during build
    }

    return sitemapEntries;
}
