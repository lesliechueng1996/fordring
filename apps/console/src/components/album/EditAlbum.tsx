import { useState } from 'react';
import { Album, getAlbumById, getErrorMessage, updateAlbum } from '../../apis/album-api';
import useMount from '../../hooks/useMount';
import { API_OK } from '../../apis/http-request';
import useToast from '../../hooks/useToast';
import AlbumForm, { FormData } from './AlbumForm';

type Props = {
  id: number;
  onEditSuccess: () => void;
};

function EditAlbum({ id, onEditSuccess }: Props) {
  const [album, setAlbum] = useState<Album>();
  const { error } = useToast();
  const [isPending, setIsPending] = useState(false);

  useMount(() => {
    getAlbumById(id).then((res) => {
      if (res.code === API_OK) {
        setAlbum(res.data as Album);
      } else {
        error(getErrorMessage(res.code));
      }
    });
  });

  const handleFormSubmit = (e: FormData) => {
    const { displayName, folderName, previewUrl, description } = e;
    if (album) {
      setIsPending(true);
      updateAlbum(id, displayName, folderName, previewUrl, description, album?.version)
        .then((res) => {
          if (res.code === API_OK) {
            onEditSuccess();
          } else {
            error(getErrorMessage(res.code));
          }
        })
        .finally(() => setIsPending(false));
    }
  };

  return (
    <AlbumForm
      title="编辑图册"
      isPending={isPending}
      onFormSubmit={handleFormSubmit}
      initData={{
        displayName: album?.displayName || '',
        folderName: album?.folderName || '',
        previewUrl: album?.previewUrl || '',
        description: album?.description || '',
      }}
    />
  );
}

export default EditAlbum;
