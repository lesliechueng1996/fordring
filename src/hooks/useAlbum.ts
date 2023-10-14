import { useState } from 'react';
import { Album, deleteAlbumById, getAllAlbums } from '../apis/album-api';
import { API_OK } from '../apis/http-request';
import useToast from './useToast';

function useAlbum() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const { error, success } = useToast();

  const search = () => {
    getAllAlbums().then((res) => {
      if (res.code === API_OK) {
        const { list } = res.data as {
          list: Array<Album>;
        };
        setAlbums(list);
      } else {
        error('获取图册列表失败');
      }
    });
  };

  const deleteAlbum = (id: number) => {
    deleteAlbumById(id).then((res) => {
      if (res.code === API_OK) {
        success('图册删除成功');
        search();
      } else {
        error('图册删除失败');
      }
    });
  };

  return {
    albums,
    search,
    deleteAlbum,
  };
}

export default useAlbum;
