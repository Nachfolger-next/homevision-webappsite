import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Locale } from '@/i18n-config';

export interface JournalArticle {
    slug: string;
    lang: Locale;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    img: string;
    featured?: boolean;
    content: string;
}

const JOURNAL_DIR = path.join(process.cwd(), 'src/content/journal');

export function getArticleSlugs(): string[] {
    if (!fs.existsSync(JOURNAL_DIR)) {
        return [];
    }
    // Read subdirectories in src/content/journal which represent articles
    return fs.readdirSync(JOURNAL_DIR).filter((slug) => {
        const fullPath = path.join(JOURNAL_DIR, slug);
        return fs.statSync(fullPath).isDirectory();
    });
}

export function getArticleBySlug(slug: string, lang: Locale): JournalArticle | null {
    try {
        const articleDir = path.join(JOURNAL_DIR, slug);
        // Fallback to 'en' if the specific language is not found
        let targetFile = path.join(articleDir, `${lang}.md`);

        if (!fs.existsSync(targetFile)) {
            targetFile = path.join(articleDir, `en.md`);
            if (!fs.existsSync(targetFile)) {
                return null;
            }
        }

        const fileContents = fs.readFileSync(targetFile, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            lang: data.lang || lang,
            title: data.title || '',
            excerpt: data.excerpt || '',
            category: data.category || 'Article',
            date: data.date || '',
            img: data.img || '',
            featured: data.featured === true,
            content,
        };
    } catch (e) {
        console.error(`Error reading article ${slug}:`, e);
        return null;
    }
}

export function getAllArticles(lang: Locale): JournalArticle[] {
    const slugs = getArticleSlugs();
    const articles: JournalArticle[] = [];

    for (const slug of slugs) {
        const article = getArticleBySlug(slug, lang);
        if (article) {
            articles.push(article);
        }
    }

    // Sort articles by date descending
    return articles.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}
