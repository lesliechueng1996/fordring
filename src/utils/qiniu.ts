import * as qiniu from 'qiniu-js';
import { getSimpleUploadToken } from '../apis/picture-api';
import { API_OK } from '../apis/http-request';
import { UploadProgress } from 'qiniu-js/esm/upload';

type UploadCompleteData = { hash: string; key: string };

export const uploadFile = async (file: File, onNext?: (progress: UploadProgress) => void) => {
  return new Promise((resolve: (data: UploadCompleteData) => void, reject) => {
    getSimpleUploadToken().then((res) => {
      if (res.code !== API_OK) {
        reject(new Error('获取上传凭证失败'));
        return;
      }

      const token = res.data as string;

      const observable = qiniu.upload(file, null, token, {
        fname: file.name,
        mimeType: file.type,
      });

      observable.subscribe({
        next: (res) => {
          onNext && onNext(res);
        },
        error: (err) => {
          console.error('上传失败', err);
          reject(new Error('上传失败'));
        },
        complete: (data: UploadCompleteData) => {
          resolve(data);
        },
      });
    });
  });
};

export const compressImage = async (file: File, quality: number = 0.2) => {
  return new Promise((resolve: (data: File) => void, reject) => {
    qiniu.compressImage(file, { noCompressIfLarger: true, quality }).then((res) => {
      const { dist } = res;
      if (dist instanceof Blob) {
        resolve(new File([dist], file.name, { type: file.type }));
      } else {
        resolve(dist);
      }
    }, reject);
  });
};
