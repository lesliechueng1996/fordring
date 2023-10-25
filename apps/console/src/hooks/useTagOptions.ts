import { useState } from 'react';
import useMount from './useMount';
import { getTagOptions } from '../apis/tag-api';
import { API_OK } from '../apis/http-request';
import useToast from './useToast';

function useTagOptions(defaultOption?: DropdownOption) {
  const [tagOptions, setTagOptions] = useState<DropdownOption[]>([]);
  const { error } = useToast();

  useMount(() => {
    getTagOptions().then((res) => {
      if (res.code === API_OK) {
        const options = [...(res.data as DropdownOption[])];

        if (defaultOption) {
          options.unshift(defaultOption);
        }

        setTagOptions(options);
      } else {
        error('获取标签列表失败');
      }
    });
  });

  return {
    tagOptions,
  };
}

export default useTagOptions;
