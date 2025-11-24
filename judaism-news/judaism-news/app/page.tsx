import { getMixedFeed } from '@/lib/feed';
import ArticleCard from '@/components/ArticleCard';

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
    const articles = await getMixedFeed(1, 40);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900">עדכונים אחרונים</h2>
                <p className="text-gray-600 mt-2">כל החדשות ממדורי היהדות המובילים במקום אחד</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <ArticleCard key={article.id} article={article as any} />
                ))}
            </div>

            {articles.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500">עדיין אין כתבות. המערכת תתעדכן בקרוב.</p>
                </div>
            )}
        </div>
    );
}
