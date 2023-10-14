import { useState } from 'react';
import AlbumForm, { FormData } from './AlbumForm';
import useToast from '../../hooks/useToast';
import { createAlbum, getErrorMessage } from '../../apis/album-api';
import { API_OK } from '../../apis/http-request';

type Props = {
  onSuccess: () => void;
};

function CreateAlbum({ onSuccess }: Props) {
  const [isPending, setIsPending] = useState(false);
  const { error, success } = useToast();

  const handleFormSubmit = (e: FormData) => {
    const { displayName, folderName, previewUrl, description } = e;

    setIsPending(true);
    createAlbum(displayName, folderName, previewUrl, description)
      .then((res) => {
        if (res.code === API_OK) {
          success('创建图册成功');
          onSuccess();
        } else {
          error(getErrorMessage(res.code));
        }
      })
      .finally(() => setIsPending(false));
  };

  return <AlbumForm title="创建图册" isPending={isPending} onFormSubmit={handleFormSubmit} />;
}

export default CreateAlbum;
