import { sendRequest } from './http-request';

export async function saveDraftArticle(title: string, content: string) {
  try {
    const data = await sendRequest('/article/draft', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
    });
    return data;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
}
