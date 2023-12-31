import qs from 'qs';
import { sendRequest } from './http-request';
import type {
  PageArticleReq,
  PageArticleItem,
  PageArticleRes,
} from '@fordring/api-type';

export type {
  GetArticleRes,
  PageArticleReq,
  PageArticleItem,
} from '@fordring/api-type';

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
  content: string,
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

export type SaveArticleReq = {
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

export async function draftToArticle(
  article: SaveArticleReq,
  articleId: string,
) {
  try {
    const data = await sendRequest(`/article/${articleId}`, {
      method: 'PUT',
      body: JSON.stringify(article),
    });
    return data;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
}

export type PageArticleData = PageArticleRes;

export async function getArticlesByPage(query: PageArticleReq) {
  try {
    const data = await sendRequest(`/article/page?${qs.stringify(query)}`);
    return data as ApiJsonResult<{
      total: number;
      list: PageArticleItem[];
    }>;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
}

export async function deleteArticle(id: string) {
  try {
    const data = await sendRequest(`/article/${id}`, {
      method: 'DELETE',
    });
    return data;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
}

export async function updateArticleTop(
  id: string,
  isTop: boolean,
  version: number,
) {
  try {
    const data = await sendRequest(`/article/${id}/top`, {
      method: 'PATCH',
      body: JSON.stringify({ isTop, version }),
    });
    return data;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
}

export async function updateArticleFire(
  id: string,
  isFire: boolean,
  version: number,
) {
  try {
    const data = await sendRequest(`/article/${id}/fire`, {
      method: 'PATCH',
      body: JSON.stringify({ isFire, version }),
    });
    return data;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
}

export async function updateArticleStatus(
  id: string,
  status: number,
  version: number,
) {
  try {
    const data = await sendRequest(`/article/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, version }),
    });
    return data;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
}

export async function getArticle(id: string) {
  try {
    const data = await sendRequest(`/article/${id}`);
    return data;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
}

export type UpdateArticleRea = SaveArticleReq & { version: number };

export async function updateArticle(id: string, article: UpdateArticleRea) {
  try {
    const data = await sendRequest(`/article/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(article),
    });
    return data;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
}
