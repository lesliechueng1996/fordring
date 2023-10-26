import { useState } from 'react';
import ArticlePropsForm, { FormData } from './ArticlePropsForm';
import { SaveArticleReq } from '../../apis/article-api';

type Props = {
  onSuccess: (
    article: Omit<SaveArticleReq, 'title' | 'content'>
  ) => Promise<void>;
  initData: Omit<SaveArticleReq, 'title' | 'content'>;
};

function EditArticleProps({ onSuccess, initData }: Props) {
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
      title="编辑文章"
      isPending={isPending}
      onFormSubmit={handleFormSubmit}
      initData={{
        status: initData.status === 1,
        categoryId: initData.categoryId?.toString() || '',
        previewUrl: initData.previewUrl,
        isTop: initData.isTop,
        isFire: initData.isFire,
        tagIds: initData.tagIds.map((id) => id.toString()),
      }}
    />
  );
}

export default EditArticleProps;
