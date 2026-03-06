/**
 * Utility for translating dynamic text using the free Google Translate API.
 * Uses Next.js `force-cache` to persist translations across requests indefinitely,
 * avoiding the need to hitting the API repeatedly or using a database.
 */

export async function translateText(text: string | null | undefined, targetLang: string): Promise<string> {
    if (!text || text.trim() === '') return '';
    if (targetLang === 'en') return text;

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=en&tl=${targetLang}&dt=t`;
        const body = new URLSearchParams();
        body.append('q', text);

        // We use force-cache so the exact combination of URL + body (which includes the text)
        // is cached indefinitely by Next.js / Vercel Data Cache.
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            },
            body: body.toString(),
            cache: 'force-cache',
        });

        if (!res.ok) {
            console.error(`Translation API error: ${res.statusText}`);
            return text; // Fallback to original text
        }

        const data = await res.json();

        // The Google Translate API returns an array of arrays.
        // The first element contains arrays where the first item is the translated text part.
        // e.g. [ [["Γεια σου", "Hello", null, null, 1]], null, "en", null, ... ]
        let translatedText = '';
        if (data && Array.isArray(data[0])) {
            data[0].forEach((part: any[]) => {
                if (part[0]) {
                    translatedText += part[0];
                }
            });
        }

        return translatedText || text;
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Fallback to original text on error
    }
}
