import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

interface ArticleProps {
    article: {
        id: string;
        title: string;
        url: string;
        imageUrl: string | null;
        summary: string | null;
        publishedAt: Date;
        source: {
            name: string;
            logoUrl: string;
        } | null;
        isInternal: boolean;
    };
}

export default function ArticleCard({ article }: ArticleProps) {
    const isInternal = article.isInternal;
    const href = isInternal ? `/article/${article.id}` : article.url;
    const target = isInternal ? undefined : '_blank';

    return (
        <div className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border ${isInternal ? 'border-primary-200 ring-1 ring-primary-100' : 'border-gray-100'}`}>
            {article.imageUrl && (
                <div className="relative h-48 w-full bg-gray-200">
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    {isInternal && (
                        <span className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                            בלעדי
                        </span>
                    )}
                </div>
            )}
            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    {article.source && (
                        <img
                            src={article.source.logoUrl}
                            alt={article.source.name}
                            className="h-6 w-auto object-contain max-w-[80px]"
                        />
                    )}
                    <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true, locale: he })}
                    </span>
                </div>
                <Link href={href} target={target} className="block group">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-700 line-clamp-2">
                        {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                        {article.summary?.replace(/<[^>]*>/g, '')}
                    </p>
                </Link>
            </div>
        </div>
    );
}
