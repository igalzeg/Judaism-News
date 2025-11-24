import prisma from '@/lib/db';
import ArticleCard from '@/components/ArticleCard';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

export default async function ArticlePage({ params }: { params: { id: string } }) {
    const article = await prisma.article.findUnique({
        where: { id: params.id },
        include: { source: true }
    });

    if (!article || !article.isInternal) {
        notFound();
    }

    // Fetch related articles (3 external, 1 internal)
    const externalRelated = await prisma.article.findMany({
        where: { isInternal: false, id: { not: article.id } },
        orderBy: { publishedAt: 'desc' },
        take: 3,
        include: { source: true }
    });

    const internalRelated = await prisma.article.findFirst({
        where: { isInternal: true, id: { not: article.id } },
        orderBy: { publishedAt: 'desc' },
        include: { source: true }
    });

    const relatedArticles = [...externalRelated];
    if (internalRelated) {
        relatedArticles.push(internalRelated);
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <article className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
                {article.imageUrl && (
                    <div className="h-96 w-full relative">
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <div className="p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
                    <div className="flex items-center text-gray-500 mb-8 text-sm">
                        <span>{format(new Date(article.publishedAt), 'dd בMMMM yyyy', { locale: he })}</span>
                        <span className="mx-2">•</span>
                        <span>מערכת האתר</span>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {article.content}
                    </div>
                </div>
            </article>

            <section>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-r-4 border-primary-500 pr-4">
                    אולי יעניין אותך גם
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedArticles.map((item) => (
                        <ArticleCard key={item.id} article={item as any} />
                    ))}
                </div>
            </section>
        </div>
    );
}
