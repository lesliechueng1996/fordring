import { sendRequest } from './http-request';
import qs from 'qs';

export const CATEGORY_ALREADY_EXIST = 20001;
export const CREATE_CATEGORY_FAILED = 20002;
export const CATEGORY_NOT_FOUND = 20003;
export const CATEGORY_VERSION_CONFLICT = 20004;

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

export type CategoryPageItem = {
  id: number;
  categoryName: string;
  createTime: number;
  version: number;
};

export type CategoryPageData = {
  total: number;
  list: Array<CategoryPageItem>;
};

export async function searchCategoryByPage(
  categoryName: string,
  currentPage: number,
  pageSize: number,
  sortField: string | undefined,
  sortOrder: string | null
) {
  try {
    const queryString = qs.stringify({
      categoryName,
      currentPage,
      pageSize,
      sortField: sortField || '',
      sortOrder: sortOrder || '',
    });
    const data = await sendRequest(`/category/page?${queryString}`);
    return data as ApiJsonResult<CategoryPageData>;
  } catch (e) {
    return e as ApiJsonResult<unknown>;
  }
}

export async function deleteCategoryById(id: number) {
  try {
    const data = await sendRequest(`/category/${id}`, {
      method: 'DELETE',
    });
    return data;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
}

export async function getCategoryById(id: number) {
  try {
    const data = await sendRequest(`/category/${id}`);
    return data;
  } catch (e) {
    return e as ApiJsonResult<unknown>;
  }
}

export async function updateCategory(id: number, categoryName: string, version: number) {
  try {
    const data = await sendRequest(`/category/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ categoryName, version }),
    });
    return data;
  } catch (e) {
    return e as ApiJsonResult<unknown>;
  }
}
