import { Locale } from '@/i18n-config';

const dictionaries: Record<string, () => Promise<Record<string, string>>> = {
    el: () => import('@/translations/el.json').then(m => m.default),
    en: () => import('@/translations/en.json').then(m => m.default),
    ru: () => import('@/translations/ru.json').then(m => m.default),
    tr: () => import('@/translations/tr.json').then(m => m.default),
    bg: () => import('@/translations/bg.json').then(m => m.default),
    he: () => import('@/translations/he.json').then(m => m.default),
};

export type Dictionary = Record<string, string>;

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
    const loader = dictionaries[locale] || dictionaries['el'];
    return loader();
};

// Client-side helper: synchronous translation lookup with fallback
export const t = (dict: Dictionary, key: string, fallback?: string): string => {
    return dict[key] || fallback || key;
};
