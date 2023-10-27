import { PaginationReq } from './common-api';

export interface GetArticleRes {
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
}

export interface PageArticleReq extends PaginationReq {
  title: string | null | undefined;
  status: number | undefined;
  categoryId: number | undefined;
  tagId: number | undefined;
  isTop: boolean | undefined;
  isFire: boolean | undefined;
  isDraft: boolean | undefined;
}

export interface PageArticleItem {
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
  tags: Array<{
    id: number;
    tagName: string;
    color: string;
  }>;
}

export interface PageArticleRes {
  total: number;
  list: PageArticleItem[];
}
