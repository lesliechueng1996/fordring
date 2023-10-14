import { useState } from 'react';
import { Album, getAlbumById, getErrorMessage as getAlbumApiErrMsg } from '../apis/album-api';
import { API_OK } from '../apis/http-request';
import useToast from './useToast';

function useAlbumPicture(id: number) {
  const [album, setAlbum] = useState<Album>();
  const { error } = useToast();

  const loadAlbum = () => {
    getAlbumById(id).then((res) => {
      if (res.code === API_OK) {
        setAlbum(res.data as Album);
      } else {
        error(getAlbumApiErrMsg(res.code));
      }
    });
  };

  return {
    album,
    loadAlbum,
  };
}

export default useAlbumPicture;
