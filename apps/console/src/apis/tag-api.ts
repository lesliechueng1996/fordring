import qs from 'qs';
import { sendRequest } from './http-request';
import { PageTagItem, PageTagRes } from '@fordring/api-type';

export const TAG_ALREADY_EXIST = 50001;
export const CREATE_TAG_FAILED = 50002;
export const UPDATE_TAG_FAILED = 50003;
export const TAG_VERSION_CONFLICT = 50004;

const ERROR_MSG_MAP: {
  [key: number]: string;
} = {
  [TAG_ALREADY_EXIST]: '标签已存在',
  [CREATE_TAG_FAILED]: '创建标签失败',
  [UPDATE_TAG_FAILED]: '更新标签失败',
  [TAG_VERSION_CONFLICT]: '标签版本冲突',
};

export function getErrorMsg(code: number) {
  const msg = ERROR_MSG_MAP[code];
  return msg || '未知错误';
}

export async function createTag(tagName: string, color: string) {
  try {
    const data = await sendRequest('/tag', {
      method: 'POST',
      body: JSON.stringify({ tagName, color }),
    });
    return data as ApiJsonResult<unknown>;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
}

export type TagPageItem = PageTagItem;

export type TagPageData = PageTagRes;

export async function searchTagByPage(
  tagName: string,
  currentPage: number,
  pageSize: number,
  sortField: string | undefined,
  sortOrder: string | null
) {
  try {
    const queryString = qs.stringify({
      tagName,
      currentPage,
      pageSize,
      sortField: sortField || '',
      sortOrder: sortOrder || '',
    });
    const data = await sendRequest(`/tag/page?${queryString}`);
    return data as ApiJsonResult<TagPageData>;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
}

export type TagItem = TagPageItem;

export async function getTagById(id: number) {
  try {
    const data = await sendRequest(`/tag/${id}`);
    return data as ApiJsonResult<TagItem>;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
}

export async function updateTag(
  id: number,
  tagName: string,
  color: string,
  version: number
) {
  try {
    const data = await sendRequest(`/tag/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ tagName, color, version }),
    });
    return data as ApiJsonResult<unknown>;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
}

export async function removeTag(id: number) {
  try {
    const data = await sendRequest(`/tag/${id}`, {
      method: 'DELETE',
    });
    return data as ApiJsonResult<unknown>;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
}

export async function getTagOptions() {
  try {
    const data = await sendRequest(`/tag/options`);
    return data as ApiJsonResult<Array<DropdownOption>>;
  } catch (e) {
    return e as ApiJsonResult<null>;
  }
}
