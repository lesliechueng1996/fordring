import { useState } from 'react';
import ArticlePropsForm, { FormData } from './ArticlePropsForm';
import { SaveArticleReq } from '../../apis/article-api';

type Props = {
  onSuccess: (
    article: Omit<SaveArticleReq, 'title' | 'content'>
  ) => Promise<void>;
};

function CreateArticleProps({ onSuccess }: Props) {
  const [isPending, setIsPending] = useState(false);

  const handleFormSubmit = (data: FormData) => {
    const { categoryId, isFire, isTop, previewUrl, status, tagIds } = data;

    const article = {
      status: status ? 1 : 0,
      categoryId: categoryId === '' ? null : parseInt(categoryId, 10),
      previewUrl,
      isTop,
      isFire,
      tagIds: tagIds.map((id) => parseInt(id, 10)),
    };

    setIsPending(true);
    onSuccess(article).finally(() => setIsPending(false));
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
