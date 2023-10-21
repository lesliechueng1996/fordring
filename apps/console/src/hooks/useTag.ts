import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SortOrder, sortOrderToStr, usePaginationAndSortFromUrl } from './usePaginationAndSort';
import { TagPageData, getErrorMsg, removeTag, searchTagByPage } from '../apis/tag-api';
import useToast from './useToast';
import changeValueToStr from '../utils/changeValueToStr';
import { API_OK } from '../apis/http-request';
import { DataTableStateEvent } from 'primereact/datatable';

function useTag() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [tagName, setTagName] = useState(searchParams.get('tagName') || '');

  const [isLoading, setIsLoading] = useState(false);

  const { currentPage, pageSize, sortField, sortOrder, setPaginationAndSort, first } =
    usePaginationAndSortFromUrl(searchParams);

  const [tagPageData, setTagPageData] = useState<TagPageData>(() => {
    return {
      total: 0,
      list: [],
    };
  });

  const { success, error } = useToast();

  const _search = (tagName: string, currentPage: number, pageSize: number, sortField: string, sortOrder: SortOrder) => {
    setIsLoading(true);
    setSearchParams(changeValueToStr({ tagName, currentPage, pageSize, sortField, sortOrder }));
    searchTagByPage(tagName, currentPage, pageSize, sortField, sortOrderToStr(sortOrder))
      .then((res) => {
        if (res.code === API_OK) {
          const { data } = res as ApiJsonResult<TagPageData>;
          setTagPageData(data);
        } else {
          error(getErrorMsg(res.code));
        }
      })
      .finally(() => setIsLoading(false));
  };

  const search = () => _search(tagName, currentPage, pageSize, sortField || '', sortOrder);

  const handlePageAndSortChange = (e: DataTableStateEvent) => {
    const paginationAndSort = setPaginationAndSort(e.page, e.rows, e.sortField, e.sortOrder);
    _search(
      tagName,
      paginationAndSort.currentPage,
      paginationAndSort.pageSize,
      paginationAndSort.sortField,
      paginationAndSort.sortOrder
    );
  };

  const clear = () => {
    setTagName('');
    _search('', currentPage, pageSize, sortField || '', sortOrder);
  };

  const deleteTag = (id: number) => {
    removeTag(id).then((res) => {
      if (res.code === API_OK) {
        success('删除成功');
        search();
      } else {
        error(getErrorMsg(res.code));
      }
    });
  };

  return {
    search,
    isLoading,
    tagPageData,
    currentPage,
    pageSize,
    first,
    sortField,
    sortOrder,
    handlePageAndSortChange,
    tagName,
    setTagName,
    clear,
    deleteTag,
  };
}

export default useTag;
