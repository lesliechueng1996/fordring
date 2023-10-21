import { FormEventHandler, useState } from 'react';
import CategoryForm from './CategoryForm';
import { createCategory, getErrorMsg } from '../../apis/category-api';
import useToast from '../../hooks/useToast';
import { API_OK } from '../../apis/http-request';

type Props = {
  onSuccess: () => void;
};

function CreateCategory({ onSuccess }: Props) {
  const { error, success } = useToast();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    setIsPending(true);
    const form = e.target as HTMLFormElement;
    const categoryName = form.categoryName.value;
    if (!categoryName) {
      error('分类名称不能为空');
      return;
    }

    try {
      const res = await createCategory(categoryName);
      if (res.code === API_OK) {
        success('创建分类成功');
        onSuccess();
      } else {
        error(getErrorMsg(res.code));
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <CategoryForm
      title="创建分类"
      initData={{ categoryName: '' }}
      submitText="保存"
      isPending={isPending}
      onFormSubmit={handleSubmit}
    />
  );
}

export default CreateCategory;
