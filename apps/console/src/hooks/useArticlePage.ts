import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SortOrder,
  sortOrderToStr,
  usePaginationAndSortFromUrl,
} from './usePaginationAndSort';
import {
  PageArticleData,
  deleteArticle,
  getArticlesByPage,
  updateArticleFire,
  updateArticleStatus,
  updateArticleTop,
} from '../apis/article-api';
import { DataTableStateEvent } from 'primereact/datatable';
import changeValueToStr from '../utils/changeValueToStr';
import useToast from './useToast';
import { API_OK } from '../apis/http-request';

export type QueryParam = {
  title: string;
  status: string;
  categoryId: string;
  tagId: string;
  isTop: string;
  isFire: string;
  isDraft: string;
};

function useArticlePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [queryParam, setQueryParam] = useState<QueryParam>(() => {
    return {
      title: searchParams.get('title') ?? '',
      status: searchParams.get('status') ?? '',
      categoryId: searchParams.get('categoryId') ?? '',
      tagId: searchParams.get('tagId') ?? '',
      isTop: searchParams.get('isTop') ?? '',
      isFire: searchParams.get('isFire') ?? '',
      isDraft: searchParams.get('isDraft') ?? '',
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  const {
    currentPage,
    pageSize,
    sortField,
    sortOrder,
    setPaginationAndSort,
    first,
  } = usePaginationAndSortFromUrl(searchParams);

  const [articlePageData, setArticlePageData] = useState<PageArticleData>(
    () => {
      return {
        total: 0,
        list: [],
      };
    }
  );

  const { error, success } = useToast();

  const handlePageAndSortChange = (e: DataTableStateEvent) => {
    const paginationAndSort = setPaginationAndSort(
      e.page,
      e.rows,
      e.sortField,
      e.sortOrder
    );
    _search(
      queryParam,
      paginationAndSort.currentPage,
      paginationAndSort.pageSize,
      paginationAndSort.sortField,
      paginationAndSort.sortOrder
    );
  };

  const _search = (
    queryParam: QueryParam,
    currentPage: number,
    pageSize: number,
    sortField: string,
    sortOrder: SortOrder
  ) => {
    setIsLoading(true);
    setSearchParams(changeValueToStr(queryParam));
    getArticlesByPage({
      title: queryParam.title ?? undefined,
      status:
        queryParam.status === '' ? undefined : parseInt(queryParam.status, 10),
      categoryId:
        queryParam.categoryId === ''
          ? undefined
          : parseInt(queryParam.categoryId, 10),
      tagId:
        queryParam.tagId === '' ? undefined : parseInt(queryParam.tagId, 10),
      isTop: queryParam.isTop === '' ? undefined : queryParam.isTop === '1',
      isFire: queryParam.isFire === '' ? undefined : queryParam.isFire === '1',
      isDraft:
        queryParam.isDraft === '' ? undefined : queryParam.isDraft === '1',
      currentPage,
      pageSize,
      sortField,
      sortOrder: sortOrderToStr(sortOrder),
    })
      .then((res) => {
        if (res.code === 0) {
          const { data } = res as ApiJsonResult<PageArticleData>;
          setArticlePageData(data);
        } else {
          error('获取文章列表失败');
        }
      })
      .finally(() => setIsLoading(false));
  };

  const search = () => {
    _search(queryParam, currentPage, pageSize, sortField || '', sortOrder);
  };

  const clear = () => {
    const emptyQueryParam = {
      title: '',
      status: '',
      categoryId: '',
      tagId: '',
      isTop: '',
      isFire: '',
      isDraft: '',
    };
    setQueryParam(emptyQueryParam);
    _search(emptyQueryParam, currentPage, pageSize, sortField || '', sortOrder);
  };

  const removeArticle = (id: string) => {
    deleteArticle(id).then((res) => {
      if (res.code === 0) {
        search();
        success('删除文章成功');
      } else {
        error('删除文章失败');
      }
    });
  };

  const udpateIsTop = (id: string, isTop: boolean, version: number) => {
    updateArticleTop(id, isTop, version).then((res) => {
      if (res.code === API_OK) {
        search();
        success('更新文章置顶状态成功');
      } else {
        error('更新文章置顶状态失败');
      }
    });
  };

  const updateIsFire = (id: string, isFire: boolean, version: number) => {
    updateArticleFire(id, isFire, version).then((res) => {
      if (res.code === API_OK) {
        search();
        success('更新文章精华状态成功');
      } else {
        error('更新文章精华状态失败');
      }
    });
  };

  const updateStatus = (id: string, status: number, version: number) => {
    updateArticleStatus(id, status, version).then((res) => {
      if (res.code === API_OK) {
        search();
        success('更新文章状态成功');
      } else {
        error('更新文章状态失败');
      }
    });
  };

  return {
    queryParam,
    setQueryParam,
    articlePageData,
    isLoading,
    currentPage,
    pageSize,
    first,
    sortField,
    sortOrder,
    handlePageAndSortChange,
    search,
    clear,
    removeArticle,
    udpateIsTop,
    updateIsFire,
    updateStatus,
  };
}

export default useArticlePage;
