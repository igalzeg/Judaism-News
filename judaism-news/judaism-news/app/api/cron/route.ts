import { NextResponse } from 'next/server';
import { fetchArticles } from '@/lib/scraper';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await fetchArticles();
        return NextResponse.json({ success: true, message: 'Articles fetched successfully' });
    } catch (error) {
        console.error('Scraping error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch articles' }, { status: 500 });
    }
}
