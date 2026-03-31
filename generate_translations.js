const fs = require('fs');
const path = require('path');

const HOSTAWAY_API_BASE = 'https://api.hostaway.com/v1';

async function getAccessToken() {
    const accountId = process.env.HOSTAWAY_ACCOUNT_ID;
    const clientSecret = process.env.HOSTAWAY_CLIENT_SECRET;

    const res = await fetch(`${HOSTAWAY_API_BASE}/accessTokens`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: accountId,
            client_secret: clientSecret,
            scope: 'general',
        }),
    });

    const data = await res.json();
    return data.access_token;
}

async function hostawayFetch(endpoint, token) {
    const res = await fetch(`${HOSTAWAY_API_BASE}${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    const data = await res.json();
    return data.result;
}

// Emulate the translate API from translate.ts with exponential backoff
async function translateText(text, targetLang, retries = 5, backoffMs = 2000) {
    if (!text || text.trim() === '') return '';
    if (targetLang === 'en') return text;

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=en&tl=${targetLang}&dt=t`;
        const body = new URLSearchParams();
        body.append('q', text);

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${Math.floor(Math.random() * 20)+100}.0.0.0 Safari/537.36` // Rotate slightly
            },
            body: body.toString(),
        });

        if (!res.ok) {
            if (res.status === 429 && retries > 0) {
                console.warn(`[Rate limit] Retrying in ${backoffMs/1000}s... (${retries} attempts left)`);
                await sleep(backoffMs);
                return translateText(text, targetLang, retries - 1, backoffMs * 2);
            }
            console.error(`Translation API error for ${targetLang}: ${res.status} ${res.statusText}`);
            return text;
        }

        const data = await res.json();
        let translatedText = '';
        if (data && Array.isArray(data[0])) {
            data[0].forEach(part => {
                if (part[0]) {
                    translatedText += part[0];
                }
            });
        }
        return translatedText || text;
    } catch (error) {
        if (retries > 0) {
            console.warn(`[Network error] Retrying in ${backoffMs/1000}s... (${retries} attempts left)`);
            await sleep(backoffMs);
            return translateText(text, targetLang, retries - 1, backoffMs * 2);
        }
        console.error('Translation error:', error.message);
        return text;
    }
}

// Function with delay to avoid rate limits
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
    console.log("Fetching Hostaway Token...");
    const token = await getAccessToken();

    console.log("Fetching Listings and Amenities...");
    const listings = await hostawayFetch('/listings', token);
    const amenities = await hostawayFetch('/amenities', token);

    const languages = ['el', 'ru', 'tr', 'bg', 'he'];

    for (const lang of languages) {
        console.log(`\n--- Processing Language: ${lang} ---`);
        
        // 1. Amenities Translation
        const amenitiesPath = path.join(__dirname, 'src', 'translations', `amenities-${lang}.json`);
        let amenitiesDict = {};
        if (fs.existsSync(amenitiesPath)) {
            try { amenitiesDict = JSON.parse(fs.readFileSync(amenitiesPath, 'utf8')); } catch(e){}
        }

        console.log(`Translating ${amenities.length} amenities...`);
        let amenitiesSkipped = 0;
        for (const [i, amenity] of amenities.entries()) {
            if (amenity.name) {
                if (amenitiesDict[amenity.name] && amenitiesDict[amenity.name] !== amenity.name) {
                    amenitiesSkipped++;
                    continue; // Skip already translated
                }
                const translated = await translateText(amenity.name, lang);
                amenitiesDict[amenity.name] = translated;
                
                // Save incrementally
                if (i % 10 === 0) {
                    fs.writeFileSync(amenitiesPath, JSON.stringify(amenitiesDict, null, 2));
                }
                await sleep(800); // Increased base sleep for Google Translate limits
            }
        }
        fs.writeFileSync(amenitiesPath, JSON.stringify(amenitiesDict, null, 2));
        console.log(`Saved ${amenitiesPath} (Skipped ${amenitiesSkipped} existing)`);

        // 2. Properties Translation
        const propertiesPath = path.join(__dirname, 'src', 'translations', `properties-${lang}.json`);
        let propertiesDict = {};
        if (fs.existsSync(propertiesPath)) {
            try { propertiesDict = JSON.parse(fs.readFileSync(propertiesPath, 'utf8')); } catch(e){}
        }

        console.log(`Translating ${listings.length} properties...`);
        let propertiesSkipped = 0;
        for (const [i, listing] of listings.entries()) {
            if (propertiesDict[listing.id] && propertiesDict[listing.id].description && propertiesDict[listing.id].description !== listing.description) {
                // Heuristic: If we have a description and it's different from English, assume translated
                if (lang === 'en' || !propertiesDict[listing.id].description.includes(listing.description.slice(0, 30))) {
                    console.log(`  skipping ${listing.id} (${listing.name}) - already translated`);
                    propertiesSkipped++;
                    continue;
                }
            }
            
            console.log(`  translating ${listing.id} (${listing.name})...`);
            if (listing.description) {
                // Split large descriptions to avoid URL too long errors on translation API
                const descriptionChunks = listing.description.split('\n\n');
                let translatedChunks = [];
                for (const chunk of descriptionChunks) {
                    if (chunk.trim() !== '') {
                        const translatedChunk = await translateText(chunk, lang);
                        translatedChunks.push(translatedChunk);
                        await sleep(1000);
                    } else {
                        translatedChunks.push('');
                    }
                }
                
                propertiesDict[listing.id] = {
                    name: listing.name, // Keep names in original language usually, or translate if needed. Assuming en.
                    description: translatedChunks.join('\n\n')
                };
            } else {
                 propertiesDict[listing.id] = {
                    name: listing.name,
                    description: ""
                };
            }
            // Save incrementally
            fs.writeFileSync(propertiesPath, JSON.stringify(propertiesDict, null, 2));
        }

        fs.writeFileSync(propertiesPath, JSON.stringify(propertiesDict, null, 2));
        console.log(`Saved ${propertiesPath} (Skipped ${propertiesSkipped} existing)`);
    }

    // Also generate 'en' files just for completeness (no translation needed)
    console.log(`\n--- Generating English (en) fallbacks ---`);
    const enAmenitiesDict = {};
    amenities.forEach(a => { if (a.name) enAmenitiesDict[a.name] = a.name; });
    fs.writeFileSync(path.join(__dirname, 'src', 'translations', `amenities-en.json`), JSON.stringify(enAmenitiesDict, null, 2));
    
    const enPropertiesDict = {};
    listings.forEach(l => { 
        enPropertiesDict[l.id] = { name: l.name, description: l.description || "" }; 
    });
    fs.writeFileSync(path.join(__dirname, 'src', 'translations', `properties-en.json`), JSON.stringify(enPropertiesDict, null, 2));
    console.log("Saved en fallback files.");

    console.log("\n✅ All translations completed successfully.");
}

main().catch(console.error);
