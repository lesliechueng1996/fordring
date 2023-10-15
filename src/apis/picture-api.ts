import { sendRequest } from './http-request';

export const getSimpleUploadToken = async () => {
  try {
    const data = await sendRequest('/picture/simple-upload-token');
    return data;
  } catch (e) {
    return e as ApiJsonResult<unknown>;
  }
};
