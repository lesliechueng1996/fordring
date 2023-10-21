import { useState } from 'react';
import useToast from './useToast';
import { saveDraftArticle } from '../apis/article-api';
import { API_OK } from '../apis/http-request';

type Article = {
  title: string;
  content: string;
};

function useArticle() {
  const [article, setArticle] = useState<Article>({
    title: '',
    content: '',
  });
  const { error, success } = useToast();

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
    const { title, content } = article;
    if (!title) {
      error('请输入标题');
      return;
    }

    saveDraftArticle(title, content).then((res) => {
      if (res.code === API_OK) {
        success('保存成功');
      } else {
        error('保存失败');
      }
    });
  };

  return {
    ...article,
    setTitle,
    setContent,
    saveDraft,
  };
}

export default useArticle;
