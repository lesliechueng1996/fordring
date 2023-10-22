import { useState } from 'react';
import useToast from './useToast';
import { saveDraftArticle, updateDraftArticle } from '../apis/article-api';
import { API_OK } from '../apis/http-request';
import { useSearchParams } from 'react-router-dom';

const ARTICLE_ID = 'articleId';

type Article = {
  title: string;
  content: string;
};

function useArticle() {
  const [searchParams, setSearchParams] = useSearchParams();
  const articleId = searchParams.get(ARTICLE_ID);

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

  const validateInput = () => {
    const { title } = article;
    if (!title) {
      error('请输入标题');
      return false;
    }
    return true;
  };

  const saveDraft = () => {
    if (!validateInput()) {
      return;
    }

    const { title, content } = article;

    if (articleId) {
      updateDraftArticle(articleId, title, content).then((res) => {
        if (res.code === API_OK) {
          success('保存成功');
        } else {
          error('保存失败');
        }
      });
    } else {
      saveDraftArticle(title, content).then((res) => {
        if (res.code === API_OK) {
          success('保存成功');
          const { id } = res.data as { id: string };
          setSearchParams({ [ARTICLE_ID]: id });
        } else {
          error('保存失败');
        }
      });
    }
  };

  const save = () => {
    if (!validateInput()) {
      return;
    }
  };

  return {
    ...article,
    setTitle,
    setContent,
    saveDraft,
    save,
  };
}

export default useArticle;
