import type {
  AllPictureItem,
  AllPicturesRes,
  GetAlbumRes,
} from '@fordring/api-type';
import { sendRequest } from './http-request';

export const ALBUM_DISPLAY_NAME_ALREADY_EXIST = 30001;
export const ALBUM_FOLDER_NAME_ALREADY_EXIST = 30002;
export const ALBUM_CREATE_FAILED = 30003;
export const ALBUM_NOT_FOUND = 30004;
export const ALBUM_VERSION_CONFLICT = 30005;
export const UPDATE_ALBUM_FAILED = 30006;
export const ALBUM_HAS_PICTURE = 30007;

const ERROR_MESSAGE_MAP: {
  [key: number]: string;
} = {
  [ALBUM_DISPLAY_NAME_ALREADY_EXIST]: '图册名称已存在',
  [ALBUM_FOLDER_NAME_ALREADY_EXIST]: '图册文件夹名称已存在',
  [ALBUM_CREATE_FAILED]: '图册创建失败',
  [ALBUM_NOT_FOUND]: '图册不存在',
  [ALBUM_VERSION_CONFLICT]: '图册版本冲突',
  [UPDATE_ALBUM_FAILED]: '图册更新失败',
  [ALBUM_HAS_PICTURE]: '图册中存在图片，无法删除',
};

export const getErrorMessage = (code: number) => {
  return ERROR_MESSAGE_MAP[code] || '未知错误';
};

export type Album = Omit<GetAlbumRes, 'pictureCount'>;

export type AlbumWithPictureCount = GetAlbumRes;

export const createAlbum = async (
  displayName: string,
  folderName: string,
  previewUrl: string,
  description: string,
) => {
  try {
    const data = await sendRequest('/album', {
      method: 'POST',
      body: JSON.stringify({
        displayName,
        folderName,
        description,
        previewUrl,
      }),
    });
    return data;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
};

export const getAllAlbums = async () => {
  try {
    const data = await sendRequest('/album/all');
    return data;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
};

export const getAlbumById = async (id: number) => {
  try {
    const data = await sendRequest(`/album/${id}`);
    return data;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
};

export const updateAlbum = async (
  id: number,
  displayName: string,
  folderName: string,
  previewUrl: string,
  description: string,
  version: number,
) => {
  try {
    const data = await sendRequest(`/album/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        displayName,
        folderName,
        description,
        previewUrl,
        version,
      }),
    });
    return data;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
};

export const deleteAlbumById = async (id: number) => {
  try {
    const data = await sendRequest(`/album/${id}`, {
      method: 'DELETE',
    });
    return data;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
};

export type AlbumPictureResItem = AllPictureItem;

export type AlbumPictureRes = AllPicturesRes;

export const getAlbumPictures = async (id: number) => {
  try {
    const data = await sendRequest(`/album/${id}/pictures`);
    return data as ApiJsonResult<AlbumPictureRes>;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
};

export const getAlbumOptions = async () => {
  try {
    const data = await sendRequest('/album/options');
    return data as ApiJsonResult<DropdownOption[]>;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
};
