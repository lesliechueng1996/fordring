import useToast from './useToast';
import {
  GetArticleRes,
  SaveArticleReq,
  draftToArticle,
  getArticle,
  saveArticle,
  saveDraftArticle,
  updateDraftArticle,
} from '../apis/article-api';
import { API_OK } from '../apis/http-request';
import { useSearchParams } from 'react-router-dom';
import type { Article } from '../components/article/ArticleForm';
import useMount from './useMount';
import { useState } from 'react';

const ARTICLE_ID = 'articleId';

function useArticle() {
  const [initArticle, setInitArticle] = useState<Article>({
    title: '',
    content: '',
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const articleId = searchParams.get(ARTICLE_ID);

  const { error, success } = useToast();

  useMount(() => {
    if (articleId) {
      getArticle(articleId).then((res) => {
        if (res.code === API_OK) {
          const article = res.data as GetArticleRes;
          if (article.isDraft) {
            setInitArticle({
              title: article.title,
              content: article.content,
            });
          }
        }
      });
    }
  });

  const saveDraft = (article: Article) => {
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

  const save = async (article: SaveArticleReq) => {
    if (articleId) {
      return draftToArticle(article, articleId).then((res) => {
        if (res.code === API_OK) {
          success('保存成功');
        } else {
          error('保存失败');
        }
      });
    } else {
      return saveArticle(article).then((res) => {
        if (res.code === API_OK) {
          success('保存成功');
        } else {
          error('保存失败');
        }
      });
    }
  };

  return {
    save,
    saveDraft,
    initArticle,
  };
}

export default useArticle;
