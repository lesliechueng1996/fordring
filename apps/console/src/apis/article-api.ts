import qs from 'qs';
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
  articleId: string
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

export type PageArticleReq = {
  title: string | undefined;
  status: number | undefined;
  categoryId: number | undefined;
  tagId: number | undefined;
  isTop: boolean | undefined;
  isFire: boolean | undefined;
  isDraft: boolean | undefined;
  currentPage: number;
  pageSize: number;
  sortField: string | undefined | null;
  sortOrder: 'ASC' | 'DESC' | '' | undefined | null;
};

export type PageArticleItem = {
  id: string;
  title: string;
  author: string;
  status: number;
  categoryName: string;
  viewCount: number;
  previewUrl: string | null;
  isTop: boolean;
  isFire: boolean;
  isDraft: boolean;
  version: number;
  updateTime: number;
  tags: {
    id: number;
    tagName: string;
    color: string;
  }[];
};

export type PageArticleData = {
  total: number;
  list: PageArticleItem[];
};

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
  version: number
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
  version: number
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
  version: number
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

export type GetArticleRes = {
  id: string;
  title: string;
  author: string;
  content: string;
  status: number;
  categoryId: number | null;
  previewUrl: string | null;
  isTop: boolean;
  isFire: boolean;
  isDraft: boolean;
  version: number;
  tags: number[];
};

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
