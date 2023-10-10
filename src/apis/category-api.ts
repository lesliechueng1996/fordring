import { sendRequest } from './http-request';

export const CATEGORY_ALREADY_EXIST = 20001;
export const CREATE_CATEGORY_FAILED = 20002;

export async function createCategory(categoryName: string): Promise<ApiJsonResult<unknown>> {
  try {
    const data: ApiJsonResult<unknown> = await sendRequest('/category', {
      method: 'POST',
      body: JSON.stringify({ categoryName }),
    });
    return data;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
}
