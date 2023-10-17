import { useState } from 'react';
import TagForm, { FormData } from './TagForm';
import { TagItem, getErrorMsg, getTagById, updateTag } from '../../apis/tag-api';
import useMount from '../../hooks/useMount';
import useToast from '../../hooks/useToast';
import { API_OK } from '../../apis/http-request';

type Props = {
  id: number;
  onSuccess: () => void;
};

function EditTag({ id, onSuccess }: Props) {
  const [isPending, setIsPending] = useState(false);
  const [tag, setTag] = useState<TagItem>();
  const { error, success } = useToast();

  useMount(() => {
    getTagById(id).then((res) => {
      if (res.code === API_OK) {
        setTag(res.data as TagItem);
      } else {
        error(getErrorMsg(res.code));
      }
    });
  });

  const handleFormSubmit = (data: FormData) => {
    setIsPending(true);
    updateTag(id, data.tagName, data.color, tag?.version ?? 0)
      .then((res) => {
        if (res.code === API_OK) {
          success('更新成功');
          onSuccess();
        } else {
          error(getErrorMsg(res.code));
        }
      })
      .finally(() => setIsPending(false));
  };

  return (
    <div>
      {tag ? (
        <TagForm
          title="编辑标签"
          submitText="保存"
          initData={{ tagName: tag?.tagName ?? '', color: tag?.color ?? '' }}
          isPending={isPending}
          onFormSubmit={handleFormSubmit}
        />
      ) : null}
    </div>
  );
}

export default EditTag;
