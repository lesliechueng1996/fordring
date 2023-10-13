import { useState } from 'react';
import { searchCategoryByPage, CategoryPageData, deleteCategoryById } from '../apis/category-api';
import usePaginationAndSort, {
  SortOrder,
  fromUrlStringToCurrentPage,
  fromUrlStringToPageSize,
  fromUrlStringToSortOrder,
  sortOrderToStr,
} from './usePaginationAndSort';
import type { DataTableStateEvent } from 'primereact/datatable';
import { API_OK } from '../apis/http-request';
import useToast from './useToast';
import { useSearchParams } from 'react-router-dom';
import changeValueToStr from '../utils/changeValueToStr';

function useCategory() {
  // Url params
  const [searchParams, setSearchParams] = useSearchParams();

  // Search State
  const [categoryName, setCategoryName] = useState(searchParams.get('categoryName') || '');

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Pagination and Sort
  const { currentPage, pageSize, sortField, sortOrder, setPaginationAndSort, first } = usePaginationAndSort(
    fromUrlStringToCurrentPage(searchParams.get('currentPage')),
    fromUrlStringToPageSize(searchParams.get('pageSize')),
    searchParams.get('sortField') || '',
    fromUrlStringToSortOrder(searchParams.get('sortOrder'))
  );

  // Table Data
  const [categoryPageData, setCategoryPageData] = useState<CategoryPageData>(() => {
    return {
      total: 0,
      list: [],
    };
  });
  const { error } = useToast();

  const _search = (
    categoryName: string,
    currentPage: number,
    pageSize: number,
    sortField: string,
    sortOrder: SortOrder
  ) => {
    setIsLoading(true);
    setSearchParams(changeValueToStr({ categoryName, currentPage, pageSize, sortField, sortOrder }));
    searchCategoryByPage(categoryName, currentPage, pageSize, sortField, sortOrderToStr(sortOrder))
      .then((res) => {
        if (res.code === API_OK) {
          const { data } = res as ApiJsonResult<CategoryPageData>;
          setCategoryPageData(data);
        } else {
          error(res.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const search = () => {
    _search(categoryName, currentPage, pageSize, sortField || '', sortOrder);
  };

  const handlePageAndSortChange = (e: DataTableStateEvent) => {
    const paginationAndSort = setPaginationAndSort(e.page, e.rows, e.sortField, e.sortOrder);
    _search(
      categoryName,
      paginationAndSort.currentPage,
      paginationAndSort.pageSize,
      paginationAndSort.sortField,
      paginationAndSort.sortOrder
    );
  };

  const clear = () => {
    setCategoryName('');
    _search('', currentPage, pageSize, sortField || '', sortOrder);
  };

  const deleteCategory = (id: number) => {
    deleteCategoryById(id).then((res) => {
      if (res.code === API_OK) {
        search();
      } else {
        error(res.message);
      }
    });
  };

  return {
    search,
    isLoading,
    categoryPageData,
    currentPage,
    pageSize,
    first,
    sortField,
    sortOrder,
    handlePageAndSortChange,
    categoryName,
    setCategoryName,
    clear,
    deleteCategory,
  };
}

export default useCategory;
