import { FormEventHandler, useState } from 'react';
import CategoryForm from './CategoryForm';
import useMount from '../../hooks/useMount';
import {
  CATEGORY_NOT_FOUND,
  CATEGORY_VERSION_CONFLICT,
  getCategoryById,
  updateCategory,
} from '../../apis/category-api';
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
    setIsPending(true);
    const { id, version } = category;
    updateCategory(id, newCategoryName, version)
      .then((res: ApiJsonResult<unknown>) => {
        if (res.code === API_OK) {
          success('保存分类成功');
          onSuccess();
        } else if (res.code === CATEGORY_NOT_FOUND) {
          error('分类不存在');
        } else if (res.code === CATEGORY_VERSION_CONFLICT) {
          error('分类信息已过期，请刷新页面后重试');
        } else {
          error('保存分类失败');
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
