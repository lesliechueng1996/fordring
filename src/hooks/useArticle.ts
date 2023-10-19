import { useState } from 'react';
import useToast from './useToast';

type Article = {
  title: string;
  content: string;
};

function useArticle() {
  const [article, setArticle] = useState<Article>({
    title: '',
    content: '',
  });
  const { error } = useToast();

  const setTitle = (title: string) => {
    setArticle({
      ...article,
      title,
    });
  };

  const setContent = (content: string) => {
    setArticle({
      ...article,
      content,
    });
  };

  const saveDraft = () => {
    const { title } = article;
    if (!title) {
      error('请输入标题');
      return;
    }

    // TODO invoke api
  };

  return {
    ...article,
    setTitle,
    setContent,
    saveDraft,
  };
}

export default useArticle;
