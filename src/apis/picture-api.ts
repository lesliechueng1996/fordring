import { sendRequest } from './http-request';

export const getSimpleUploadToken = async () => {
  try {
    const data = await sendRequest('/picture/simple-upload-token');
    return data;
  } catch (e) {
    return e as ApiJsonResult<unknown>;
  }
};

export const savePicture = async (albumId: number, name: string, storageKey: string, description: string) => {
  try {
    const data = await sendRequest('/picture', {
      method: 'POST',
      body: JSON.stringify({
        albumId,
        name,
        storageKey,
        description,
      }),
    });
    return data;
  } catch (e) {
    return e as ApiJsonResult<unknown>;
  }
};

export const deletePicture = async (id: number) => {
  try {
    const data = await sendRequest(`/picture/${id}`, {
      method: 'DELETE',
    });
    return data;
  } catch (e) {
    return e as ApiJsonResult<unknown>;
  }
};
