import { useState } from 'react';
import useMount from './useMount';
import { categoryOptions as getCategoryOptions } from '../apis/category-api';
import { API_OK } from '../apis/http-request';
import useToast from './useToast';

function useCategoryOptions(defaultOption?: DropdownOption) {
  const [categoryOptions, setCategoryOptions] = useState<DropdownOption[]>([]);
  const { error } = useToast();

  useMount(() => {
    getCategoryOptions().then((res) => {
      if (res.code === API_OK) {
        const options = [...(res.data as DropdownOption[])];

        if (defaultOption) {
          options.unshift(defaultOption);
        }

        setCategoryOptions(options);
      } else {
        error('获取分类列表失败');
      }
    });
  });

  return {
    categoryOptions,
  };
}

export default useCategoryOptions;
