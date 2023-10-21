import { FormEventHandler, useState } from 'react';
import CategoryForm from './CategoryForm';
import useMount from '../../hooks/useMount';
import { getErrorMsg, getCategoryById, updateCategory } from '../../apis/category-api';
import useToast from '../../hooks/useToast';
import { API_OK } from '../../apis/http-request';

type EditCategory = {
  id: number;
  categoryName: string;
  version: number;
};

type Props = {
  id: number;
  onSuccess: () => void;
};

function EditCategory({ id, onSuccess }: Props) {
  const [category, setCategory] = useState<EditCategory | null>(null);

  const { warn, error, success } = useToast();
  const [isPending, setIsPending] = useState(false);

  useMount(() => {
    getCategoryById(id).then((res: ApiJsonResult<unknown>) => {
      if (res.code === API_OK) {
        setCategory(res.data as EditCategory);
      } else {
        error('获取分类信息失败');
      }
    });
  });

  const save: FormEventHandler<HTMLFormElement> = (e) => {
    if (!category) {
      return;
    }
    const form = e.target as HTMLFormElement;
    const newCategoryName = form.categoryName.value;
    if (newCategoryName === category.categoryName) {
      warn('分类名称未改变');
      return;
    }
    if (!newCategoryName) {
      error('分类名称不能为空');
      return;
    }
    setIsPending(true);
    const { id, version } = category;
    updateCategory(id, newCategoryName, version)
      .then((res: ApiJsonResult<unknown>) => {
        if (res.code === API_OK) {
          success('保存分类成功');
          onSuccess();
        } else {
          error(getErrorMsg(res.code));
        }
      })
      .finally(() => setIsPending(false));
  };

  return (
    <CategoryForm
      title="编辑分类"
      submitText="保存"
      initData={{ categoryName: category?.categoryName || '' }}
      isPending={isPending}
      onFormSubmit={save}
    />
  );
}

export default EditCategory;
