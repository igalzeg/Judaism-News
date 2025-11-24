import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, content, imageUrl, summary } = body;

        const article = await prisma.article.create({
            data: {
                title,
                content,
                summary,
                imageUrl,
                url: `internal-${Date.now()}`, // Temporary slug
                publishedAt: new Date(),
                isInternal: true,
            }
        });

        return NextResponse.json(article);
    } catch (error) {
        console.error('Error creating article:', error);
        return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
    }
}
