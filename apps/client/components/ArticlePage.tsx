'use client';

import useArticlePage from '@/hooks/useArticlePage';
import ArticleFilterCategoryGroup from './ArticleFilterCategoryGroup';
import Card from './Card';
import useMount from '@/hooks/useMount';

type Props = {
  labels: Parameters<typeof ArticleFilterCategoryGroup>[0]['labels'];
};

function ArticlePage({ labels }: Props) {
  const { articles, activeLabel, searchByLabel, searchByLoadMore } =
    useArticlePage();

  useMount(searchByLoadMore);

  const handleLabelChange = (id: string) => {
    searchByLabel(id);
  };

  return (
    <div className="space-y-10">
      <ArticleFilterCategoryGroup
        labels={labels}
        activeId={activeLabel}
        onLabelChange={handleLabelChange}
      />

      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {articles.map((article) => (
          <div
            key={article.id}
            className="w-full h-96 rounded-2xl overflow-hidden"
          >
            <Card {...article} horizontal />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArticlePage;
