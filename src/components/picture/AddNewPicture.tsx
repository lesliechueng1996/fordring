import { useState } from 'react';
import PictureForm, { FormData } from './PictureForm';
import { SavePictureRes, savePicture } from '../../apis/picture-api';
import { API_OK } from '../../apis/http-request';
import useToast from '../../hooks/useToast';

type Props = {
  albumId: number;
  onSuccess: (id: number, url: string) => void;
  title?: string;
};

function AddNewPicture({ albumId, onSuccess, title }: Props) {
  const [isPending, setIsPending] = useState(false);
  const { error } = useToast();

  const handleFormSubmit = (formData: FormData) => {
    const { name, storageKey, description } = formData;
    setIsPending(true);
    savePicture(albumId, name, storageKey, description)
      .then((res) => {
        if (res.code === API_OK) {
          const { id, url } = res.data as SavePictureRes;
          onSuccess(id, url);
        } else {
          error('添加图片失败');
        }
      })
      .finally(() => setIsPending(false));
  };

  return <PictureForm title={title || '添加图片'} isPending={isPending} onFormSubmit={handleFormSubmit} />;
}

export default AddNewPicture;
