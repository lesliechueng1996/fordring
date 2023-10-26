import { useNavigate, useParams } from 'react-router-dom';
import useMount from './useMount';
import { useState } from 'react';
import {
  GetArticleRes,
  UpdateArticleRea,
  getArticle,
  updateArticle,
} from '../apis/article-api';
import { API_OK } from '../apis/http-request';
import useToast from './useToast';

function useEditArticle() {
  const { articleId: editArticleId } = useParams();
  const [editArticle, setEditArticle] = useState<GetArticleRes>();
  const { error, success } = useToast();
  const navigate = useNavigate();

  useMount(() => {
    if (editArticleId) {
      getArticle(editArticleId).then((res) => {
        if (res.code === API_OK) {
          setEditArticle(res.data as GetArticleRes);
        } else {
          error('获取文章失败');
        }
      });
    }
  });

  const save = (article: UpdateArticleRea) => {
    if (!editArticleId) {
      return;
    }
    updateArticle(editArticleId, article).then((res) => {
      if (res.code === API_OK) {
        success('保存文章成功');
        navigate('/article/list');
      } else {
        error('保存文章失败');
      }
    });
  };

  return {
    editArticle,
    save,
  };
}

export default useEditArticle;
