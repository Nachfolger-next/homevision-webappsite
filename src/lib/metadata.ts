import { i18n } from '@/i18n-config';

export function getAlternates(path: string) {
    const languages: Record<string, string> = {};

    i18n.locales.forEach((locale) => {
        languages[locale] = `/${locale}${path}`;
    });

    return {
        canonical: `/${i18n.defaultLocale}${path}`,
        languages,
    };
}
