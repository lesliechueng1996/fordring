import { useState } from 'react';
import { TABLE_PAGE_SIZE, TABLE_DEFAULT_CURRENT_PAGE } from '../configs/constant';
import isNullOrUndefined from '../utils/isNullOrUndefined';
import fromUrlStringToNumber from '../utils/fromUrlStringToNumber';

export type SortOrder = 0 | -1 | 1 | null | undefined;

type PaginationAndSort = {
  currentPage: number;
  pageSize: number;
  sortField: string;
  sortOrder: SortOrder;
  first: number;
};

export const fromUrlStringToCurrentPage = fromUrlStringToNumber.bind(null, TABLE_DEFAULT_CURRENT_PAGE);

export const fromUrlStringToPageSize = fromUrlStringToNumber.bind(null, TABLE_PAGE_SIZE);

export const fromUrlStringToSortOrder = fromUrlStringToNumber.bind(null, 0) as (
  str?: string | null | undefined
) => SortOrder;

export function sortOrderToStr(sortOrder: number | null | undefined) {
  if (isNullOrUndefined(sortOrder) || sortOrder === 0) {
    return '';
  }
  return sortOrder === 1 ? 'ASC' : 'DESC';
}

function usePaginationAndSort(
  defaultCurrentPage?: number,
  defaultPageSize?: number,
  defaultSortField?: string,
  defaultSortOrder?: SortOrder
) {
  const tempCurrentPage = defaultCurrentPage || 1;
  const tempPageSize = defaultPageSize || TABLE_PAGE_SIZE;

  const [data, setData] = useState<PaginationAndSort>({
    currentPage: tempCurrentPage,
    pageSize: tempPageSize,
    sortField: defaultSortField || '',
    sortOrder: defaultSortOrder,
    first: (tempCurrentPage - 1) * tempPageSize,
  });

  const setPaginationAndSort = (
    currentPage: number | undefined,
    pageSize: number,
    sortField: string,
    sortOrder: 0 | 1 | -1 | null | undefined
  ) => {
    const tempCurrentPage = isNullOrUndefined(currentPage) ? 1 : (currentPage as number) + 1;

    const newData = {
      currentPage: tempCurrentPage,
      pageSize,
      sortField,
      sortOrder,
      first: (tempCurrentPage - 1) * pageSize,
    };
    setData(newData);
    return newData;
  };

  return {
    ...data,
    setPaginationAndSort,
  };
}

export const usePaginationAndSortFromUrl = (searchParams: URLSearchParams) => {
  return usePaginationAndSort(
    fromUrlStringToCurrentPage(searchParams.get('currentPage')),
    fromUrlStringToPageSize(searchParams.get('pageSize')),
    searchParams.get('sortField') || '',
    fromUrlStringToSortOrder(searchParams.get('sortOrder'))
  );
};

export default usePaginationAndSort;
