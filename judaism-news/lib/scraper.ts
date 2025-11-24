import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import prisma from './db';

const parser = new Parser();

const SOURCES = [
    {
        name: 'כיפה',
        url: 'https://www.kipa.co.il',
        feedUrl: 'https://www.kipa.co.il/rss/judaism.xml', // Assumed, might need adjustment
        logoUrl: 'https://www.kipa.co.il/images/logo.png',
        type: 'RSS'
    },
    {
        name: 'סרוגים',
        url: 'https://www.srugim.co.il',
        feedUrl: 'https://www.srugim.co.il/category/judaism/feed',
        logoUrl: 'https://www.srugim.co.il/wp-content/themes/srugim2016/images/logo.png',
        type: 'RSS'
    },
    {
        name: 'Ynet יהדות',
        url: 'https://www.ynet.co.il/judaism',
        feedUrl: 'http://www.ynet.co.il/Integration/StoryRss538.xml',
        logoUrl: 'https://www.ynet.co.il/images/logo.png',
        type: 'RSS'
    },
    {
        name: 'כיכר השבת',
        url: 'https://www.kikar.co.il',
        feedUrl: 'https://www.kikar.co.il/rss.xml',
        logoUrl: 'https://www.kikar.co.il/assets/images/logo.svg',
        type: 'RSS'
    },
    {
        name: 'ערוץ 7',
        url: 'https://www.inn.co.il',
        feedUrl: 'https://www.inn.co.il/Rss/Judaism.xml',
        logoUrl: 'https://www.inn.co.il/images/logo.png',
        type: 'RSS'
    },
    {
        name: 'בחדרי חרדים',
        url: 'https://www.bhol.co.il',
        feedUrl: 'https://www.bhol.co.il/rss/rss.xml', // General feed, might need filtering
        logoUrl: 'https://www.bhol.co.il/assets/images/logo.png',
        type: 'RSS'
    }
];

export async function syncSources() {
    for (const source of SOURCES) {
        await prisma.source.upsert({
            where: { url: source.url }, // Using URL as a pseudo-unique key for seed
            update: source,
            create: source,
        });
    }
}

export async function fetchArticles() {
    await syncSources();
    const sources = await prisma.source.findMany();

    for (const source of sources) {
        try {
            if (source.type === 'RSS' && source.feedUrl) {
                const feed = await parser.parseURL(source.feedUrl);

                for (const item of feed.items) {
                    if (!item.link || !item.title) continue;

                    // Check if exists
                    const exists = await prisma.article.findUnique({
                        where: { url: item.link }
                    });

                    if (!exists) {
                        // Extract image from content if possible
                        let imageUrl = null;
                        if (item.contentSnippet) {
                            // Basic heuristic to find image in CDATA or content
                            // This is simplified; real implementation needs robust HTML parsing
                        }
                        if (item.enclosure && item.enclosure.url) {
                            imageUrl = item.enclosure.url;
                        }

                        await prisma.article.create({
                            data: {
                                title: item.title,
                                url: item.link,
                                summary: item.contentSnippet?.substring(0, 200) || '',
                                publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
                                sourceId: source.id,
                                imageUrl: imageUrl
                            }
                        });
                    }
                }
            }
        } catch (error) {
            console.error(`Error fetching from ${source.name}:`, error);
        }
    }
}
