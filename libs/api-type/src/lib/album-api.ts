export interface CreateAlbumReq {
  displayName: string;
  folderName: string;
  description: string;
  previewUrl: string;
}

export interface CreateAlbumRes {
  id: number;
}

export interface GetAlbumRes {
  id: number;
  displayName: string;
  folderName: string;
  description: string | null;
  previewUrl: string | null;
  version: number;
  pictureCount: number;
}

export interface AllAlbumsRes {
  list: GetAlbumRes[];
}

export interface UpdateAlbumReq {
  displayName: string;
  folderName: string;
  description: string;
  previewUrl: string;
  version: number;
}

export interface AllPictureItem {
  id: number;
  name: string;
  url: string;
  description: string;
  createTime: number;
  version: number;
}

export interface AllPicturesRes {
  pictures: AllPictureItem[];
}
