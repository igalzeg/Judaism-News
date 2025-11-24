import prisma from './db';

export async function getMixedFeed(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // Fetch external articles
    const externalArticles = await prisma.article.findMany({
        where: { isInternal: false },
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip: skip,
        include: { source: true }
    });

    // Fetch internal articles
    // We want roughly 1 internal for every 3 external. 
    // So if we fetch 20 items, we might want ~5 internal items to mix in.
    const internalArticles = await prisma.article.findMany({
        where: { isInternal: true },
        orderBy: { publishedAt: 'desc' },
        take: Math.ceil(limit / 3),
    });

    // Mixing logic
    const mixedFeed = [];
    let extIdx = 0;
    let intIdx = 0;

    while (extIdx < externalArticles.length) {
        // Add 3 external
        for (let i = 0; i < 3 && extIdx < externalArticles.length; i++) {
            mixedFeed.push(externalArticles[extIdx++]);
        }
        // Add 1 internal if available
        if (intIdx < internalArticles.length) {
            mixedFeed.push(internalArticles[intIdx++]);
        }
    }

    return mixedFeed;
}
