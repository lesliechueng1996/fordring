import { useState } from 'react';
import {
  Album,
  getAlbumById,
  getErrorMessage as getAlbumApiErrMsg,
  getAlbumPictures,
  AlbumPictureRes,
} from '../apis/album-api';
import { API_OK } from '../apis/http-request';
import useToast from './useToast';
import toDateString from '../utils/toDateString';
import { deletePicture } from '../apis/picture-api';

export type AlbumPicture = {
  id: number;
  name: string;
  url: string;
  description: string;
  createTime: string;
  version: number;
};

function useAlbumPicture(id: number) {
  const [album, setAlbum] = useState<Album>();
  const [pictures, setPictures] = useState<AlbumPicture[]>([]);
  const { error, success } = useToast();

  const loadAlbum = () => {
    getAlbumById(id).then((res) => {
      if (res.code === API_OK) {
        setAlbum(res.data as Album);
      } else {
        error(getAlbumApiErrMsg(res.code));
      }
    });
  };

  const loadPictures = () => {
    getAlbumPictures(id).then((res) => {
      if (res.code === API_OK) {
        const { pictures } = res.data as AlbumPictureRes;
        setPictures(
          pictures.map((picture) => ({
            id: picture.id,
            name: picture.name,
            url: picture.url,
            description: picture.description,
            createTime: toDateString(picture.createTime),
            version: picture.version,
          }))
        );
      } else {
        error('获取相册图片失败');
      }
    });
  };

  const removePicture = (id: number) => {
    deletePicture(id).then((res) => {
      if (res.code === API_OK) {
        success('删除图片成功');
        loadPictures();
      } else {
        error('删除图片失败');
      }
    });
  };

  return {
    album,
    loadAlbum,
    pictures,
    loadPictures,
    removePicture,
  };
}

export default useAlbumPicture;
