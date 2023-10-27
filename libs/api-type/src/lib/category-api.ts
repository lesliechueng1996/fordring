import { PaginationReq } from './common-api';

export interface CreateCategoryReq {
  categoryName: string;
}

export interface PageCategoryReq extends PaginationReq {
  categoryName: string;
}

export interface PageCategoryItem {
  id: number;
  categoryName: string;
  createTime: number;
  version: number;
}

export interface PageCategoryRes {
  total: number;
  list: Array<PageCategoryItem>;
}

export interface GetCategoryRes {
  id: number;
  categoryName: string;
  version: number;
}

export interface UpdateCategoryReq {
  categoryName: string;
  version: number;
}
