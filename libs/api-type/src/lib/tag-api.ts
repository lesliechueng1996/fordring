import { PaginationReq } from './common-api';

// Create Tag API
export interface CreateTagReq {
  tagName: string;
  color: string;
}

// Page Tag API
export interface PageTagReq extends PaginationReq {
  tagName: string | null | undefined;
}

export interface PageTagItem {
  id: number;
  tagName: string;
  color: string;
  createTime: number;
  version: number;
}

export interface PageTagRes {
  total: number;
  list: Array<PageTagItem>;
}

// Get Tag API
export type GetTagRes = PageTagItem;

// Update Tag API
export interface UpdateTagReq {
  tagName: string;
  color: string;
  version: number;
}
