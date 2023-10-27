export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface PaginationReq {
  currentPage: number;
  pageSize: number;
  sortField: string | undefined | null;
  sortOrder: SortOrder | '' | undefined | null;
}

export interface DropdownItem {
  label: string;
  value: string;
}

export interface IApiJsonResult<T> {
  code: number;
  message: string;
  data: T;
  status: number;
}
