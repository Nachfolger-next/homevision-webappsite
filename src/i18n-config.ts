export const i18n = {
    defaultLocale: 'el',
    locales: ['el', 'en', 'ru', 'tr', 'bg', 'he'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
