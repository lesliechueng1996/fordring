import AppBanner from '@/components/AppBanner';
import ArticleList from '@/components/ArticleList';
import RecommendArticles from '@/components/RecommendArticles';

export default async function Index() {
  return (
    <main className="space-y-10 pb-10 pt-10">
      {/* 置顶 */}
      <AppBanner />
      {/* 推荐 */}
      <RecommendArticles />
      <div className="bg-background p-5 rounded-2xl flex items-start gap-5">
        {/* 文章列表 */}
        <ArticleList />
      </div>
    </main>
  );
}
