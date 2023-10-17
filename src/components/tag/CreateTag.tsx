import { useState } from 'react';
import TagForm, { FormData } from './TagForm';
import { createTag, getErrorMsg } from '../../apis/tag-api';
import { API_OK } from '../../apis/http-request';
import useToast from '../../hooks/useToast';

type Props = {
  onSuccess: () => void;
};

function CreateTag({ onSuccess }: Props) {
  const [isPending, setIsPending] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = (data: FormData) => {
    setIsPending(true);
    createTag(data.tagName, data.color)
      .then((res) => {
        if (res.code === API_OK) {
          success('创建标签成功');
          onSuccess();
        } else {
          error(getErrorMsg(res.code));
        }
      })
      .finally(() => setIsPending(false));
  };

  return <TagForm title="新建标签" submitText="保存" isPending={isPending} onFormSubmit={handleSubmit} />;
}

export default CreateTag;
