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

export async function updateDraftArticle(
  id: string,
  title: string,
  content: string
) {
  try {
    const data = await sendRequest(`/article/draft/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title, content }),
    });
    return data;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
}

type SaveArticleReq = {
  title: string;
  content: string;
  status: number;
  categoryId: number | null;
  previewUrl: string;
  isTop: boolean;
  isFire: boolean;
  tagIds: number[];
};

export async function saveArticle(article: SaveArticleReq) {
  try {
    const data = await sendRequest('/article', {
      method: 'POST',
      body: JSON.stringify(article),
    });
    return data;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
}
