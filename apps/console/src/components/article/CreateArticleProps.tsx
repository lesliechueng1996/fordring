import { useState } from 'react';
import ArticlePropsForm, { FormData } from './ArticlePropsForm';
import { SaveArticleReq } from '../../apis/article-api';

type Props = {
  title: string;
  content: string;
  onSuccess: (article: SaveArticleReq) => Promise<void>;
};

function CreateArticleProps({ title, content, onSuccess }: Props) {
  const [isPending, setIsPending] = useState(false);

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
