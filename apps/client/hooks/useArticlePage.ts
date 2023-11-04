import Card from '@/components/Card';
import { useRef, useState } from 'react';
import qs from 'qs';

type ArticleCard = Omit<Parameters<typeof Card>[0], 'horizontal'>;

function useArticlePage() {
  const lastIdRef = useRef<string | null>(null);
  const [activeLabel, setActiveLabel] = useState('');
  const [articles, setArticles] = useState<ArticleCard[]>([]);

  const search = async (label: string, clearOldData: boolean) => {
    const response = await fetch(
      `/api/articles?${qs.stringify({
        label,
        lastId: lastIdRef.current ?? '',
      })}`,
    );
    if (response.ok) {
      const data = (await response.json()) as ArticlePageResponse;
      const { articles, nextId } = data;
      lastIdRef.current = nextId;
      setArticles((prev) => {
        const newArticles = articles.map((article) => ({
          id: article.id,
          label: article.category?.categoryName || '无分类',
          labelComments: article.tags,
          title: article.title,
          content: article.content,
          previewUrl: article.previewUrl,
          avatarName: article.author,
          time: new Date(article.updateTime),
        }));
        if (clearOldData) {
          return [...newArticles];
        }

        return [...prev, ...newArticles];
      });
    }
  };

  const searchByLabel = (newLabel: string) => {
    if (newLabel !== activeLabel) {
      lastIdRef.current = null;
      setActiveLabel(newLabel);
      search(newLabel, true);
    }
  };

  const searchByLoadMore = () => {
    search(activeLabel, false);
  };

  return {
    articles,
    activeLabel,
    searchByLabel,
    searchByLoadMore,
  };
}

export default useArticlePage;
