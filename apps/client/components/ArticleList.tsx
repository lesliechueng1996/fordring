import { getAllCategories } from '@/repositories/CategoryRepository';
import { CubeTransparentIcon } from '@heroicons/react/24/outline';
import ArticlePage from './ArticlePage';

async function ArticleList() {
  const categories = await getAllCategories();
  const categoryLabels = categories.map((category) => ({
    id: category.id.toString(),
    text: category.categoryName,
  }));

  return (
    <section className="w-full">
      <div className="mb-10">
        <div className="text-label text-3xl font-bold flex items-center gap-3 mb-1">
          <CubeTransparentIcon className="w-8 h-8" />
          <h1>文章列表</h1>
        </div>
        <div className="gradient-bg h-2 w-24 rounded-sm" />
      </div>

      <ArticlePage labels={categoryLabels} />
    </section>
  );
}

export default ArticleList;
