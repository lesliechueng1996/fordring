import { getArticlesForRecommend } from '@/repositories/ArticleRepository';
import RecommendBanner from './RecommendBanner';
import CardWithTitle from './CardWithTitle';

async function RecommendArticles() {
  const recommendArticles = await getArticlesForRecommend();

  return (
    <section className="w-full flex flex-col gap-10 lg:flex-row lg:gap-5 lg:h-96">
      <RecommendBanner />

      {recommendArticles.map((article) => {
        return (
          <div key={article.id} className="w-full h-96 lg:h-[24rem]">
            <CardWithTitle
              tip="推荐"
              icon="fire"
              id={article.id}
              label={article.category?.categoryName || '无分类'}
              labelComments={article.tags}
              previewUrl={article.previewUrl}
              title={article.title}
              content={article.content}
              avatarName={article.author}
              time={article.updateTime}
            />
          </div>
        );
      })}
    </section>
  );
}

export default RecommendArticles;
