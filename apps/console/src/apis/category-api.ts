import { PageCategoryRes, PageCategoryItem } from '@fordring/api-type';
import { sendRequest } from './http-request';
import qs from 'qs';

const CATEGORY_ALREADY_EXIST = 20001;
const CREATE_CATEGORY_FAILED = 20002;
const CATEGORY_NOT_FOUND = 20003;
const CATEGORY_VERSION_CONFLICT = 20004;
const UPDATE_CATEGORY_FAILED = 20005;

const ERROR_MSG_MAP: {
  [key: number]: string;
} = {
  [CATEGORY_ALREADY_EXIST]: '分类已存在',
  [CREATE_CATEGORY_FAILED]: '创建分类失败',
  [CATEGORY_NOT_FOUND]: '分类不存在',
  [CATEGORY_VERSION_CONFLICT]: '分类信息已过期，请刷新页面后重试',
  [UPDATE_CATEGORY_FAILED]: '更新分类失败',
};

export function getErrorMsg(code: number) {
  const msg = ERROR_MSG_MAP[code];
  return msg || '未知错误';
}

export async function createCategory(
  categoryName: string
): Promise<ApiJsonResult<unknown>> {
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

export type CategoryPageItem = PageCategoryItem;

export type CategoryPageData = PageCategoryRes;

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

export async function updateCategory(
  id: number,
  categoryName: string,
  version: number
) {
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

export async function categoryOptions() {
  try {
    const data = await sendRequest('/category/options');
    return data as ApiJsonResult<DropdownOption[]>;
  } catch (e) {
    return e as ApiJsonResult<unknown>;
  }
}
