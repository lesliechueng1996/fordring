import { useState } from 'react';
import ArticlePropsForm, { FormData } from './ArticlePropsForm';
import { saveArticle } from '../../apis/article-api';
import { API_OK } from '../../apis/http-request';
import useToast from '../../hooks/useToast';

type Props = {
  title: string;
  content: string;
  onSuccess: (id: string) => void;
};

function CreateArticleProps({ title, content, onSuccess }: Props) {
  const [isPending, setIsPending] = useState(false);
  const { error, success } = useToast();

  const handleFormSubmit = (data: FormData) => {
    const { categoryId, isFire, isTop, previewUrl, status, tagIds } = data;

    const article = {
      title,
      content,
      status: status ? 1 : 0,
      categoryId: categoryId === '' ? null : parseInt(categoryId, 10),
      previewUrl,
      isTop,
      isFire,
      tagIds: tagIds.map((id) => parseInt(id, 10)),
    };

    setIsPending(true);
    saveArticle(article)
      .then((res) => {
        if (res.code === API_OK) {
          const { id } = res.data as {
            id: string;
          };
          onSuccess(id);
          success('保存成功');
        } else {
          error('保存失败');
        }
      })
      .finally(() => setIsPending(false));
  };

  return (
    <ArticlePropsForm
      title="新建文章"
      isPending={isPending}
      onFormSubmit={handleFormSubmit}
    />
  );
}

export default CreateArticleProps;
