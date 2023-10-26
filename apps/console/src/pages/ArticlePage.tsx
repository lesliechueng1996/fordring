import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import useArticlePage, { QueryParam } from '../hooks/useArticlePage';
import { ChangeEventHandler, MouseEventHandler } from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import useCategoryOptions from '../hooks/useCategoryOptions';
import useTagOptions from '../hooks/useTagOptions';
import { DataTable } from 'primereact/datatable';
import { TABLE_PAGE_SIZE_OPTIONS } from '../configs/constant';
import { Column } from 'primereact/column';
import useMount from '../hooks/useMount';
import { Tag } from 'primereact/tag';
import type { PageArticleItem } from '../apis/article-api';
import { InputSwitch } from 'primereact/inputswitch';
import toDateString from '../utils/toDateString';
import { useNavigate } from 'react-router-dom';
import { ConfirmPopup } from 'primereact/confirmpopup';
import useConfirmPopup from '../hooks/useConfirmPopup';
import { SelectButton } from 'primereact/selectbutton';

const StatusOptionsSelectButton = [
  {
    label: '显示',
    value: '1',
  },
  {
    label: '隐藏',
    value: '0',
  },
];

const StatusOptions = [
  {
    label: '全部',
    value: '',
  },
  ...StatusOptionsSelectButton,
];

const YesNoOptions = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '是',
    value: '1',
  },
  {
    label: '否',
    value: '0',
  },
];

function ArticlePage() {
  const {
    queryParam,
    setQueryParam,
    articlePageData,
    first,
    pageSize,
    sortField,
    sortOrder,
    isLoading,
    handlePageAndSortChange,
    search,
    clear,
    removeArticle,
    updateIsFire,
    udpateIsTop,
    updateStatus,
  } = useArticlePage();
  const { categoryOptions } = useCategoryOptions({
    label: '全部',
    value: '',
  });
  const { tagOptions } = useTagOptions({
    label: '全部',
    value: '',
  });
  const navigate = useNavigate();
  const showConfirm = useConfirmPopup();

  useMount(() => search());

  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setQueryParam((v) => ({ ...v, title: e.target.value }));
  };

  const confirmDelete: (
    rowData: PageArticleItem
  ) => MouseEventHandler<HTMLButtonElement> =
    (rowData: PageArticleItem) => (event) => {
      showConfirm(event.currentTarget, () => removeArticle(rowData.id));
    };

  const handleDropdownChange =
    (key: string & keyof QueryParam) => (e: DropdownChangeEvent) => {
      setQueryParam((v) => ({ ...v, [key]: e.value }));
    };

  const actionBodyTemplate = (rowData: PageArticleItem) => {
    return (
      <div className="space-x-3">
        <Button
          label="编辑"
          severity="help"
          onClick={() =>
            rowData.isDraft
              ? navigate(`/article?articleId=${rowData.id}`)
              : navigate(`/article/${rowData.id}`)
          }
        />
        <Button
          label="删除"
          severity="danger"
          onClick={confirmDelete(rowData)}
        />
      </div>
    );
  };

  function ArticleStatusColumnBody(rowData: PageArticleItem) {
    return (
      <SelectButton
        value={rowData.status.toString()}
        onChange={(e) =>
          updateStatus(rowData.id, parseInt(e.value, 10), rowData.version)
        }
        options={StatusOptionsSelectButton}
        allowEmpty={false}
      />
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between gap-10">
        <div className="flex items-center gap-8 flex-wrap">
          <div className="p-float-label">
            <InputText
              id="title"
              name="title"
              value={queryParam.title}
              onChange={handleTitleChange}
            />
            <label htmlFor="title">文章标题</label>
          </div>

          <div className="flex items-center gap-3">
            <span>是否显示</span>
            <Dropdown
              value={queryParam.status}
              options={StatusOptions}
              onChange={handleDropdownChange('status')}
            />
          </div>

          <div className="flex items-center gap-3">
            <span>分类</span>
            <Dropdown
              value={queryParam.categoryId}
              options={categoryOptions}
              onChange={handleDropdownChange('categoryId')}
            />
          </div>

          <div className="flex items-center gap-3">
            <span>标签</span>
            <Dropdown
              value={queryParam.tagId}
              options={tagOptions}
              onChange={handleDropdownChange('tagId')}
            />
          </div>

          <div className="flex items-center gap-3">
            <span>是否置顶</span>
            <Dropdown
              value={queryParam.isTop}
              options={YesNoOptions}
              onChange={handleDropdownChange('isTop')}
            />
          </div>

          <div className="flex items-center gap-3">
            <span>是否精华</span>
            <Dropdown
              value={queryParam.isFire}
              options={YesNoOptions}
              onChange={handleDropdownChange('isFire')}
            />
          </div>

          <div className="flex items-center gap-3">
            <span>是否草稿</span>
            <Dropdown
              value={queryParam.isDraft}
              options={YesNoOptions}
              onChange={handleDropdownChange('isDraft')}
            />
          </div>

          <Button
            label="搜索"
            icon="pi pi-search"
            loading={isLoading}
            onClick={() => search()}
          />
          <Button
            label="清除"
            icon="pi pi-filter-slash"
            severity="warning"
            onClick={clear}
          />
        </div>

        <div className="shrink-0">
          <Button
            label="新增"
            icon="pi pi-plus"
            severity="success"
            onClick={() => navigate('/article')}
          />
        </div>
      </div>

      <div>
        <DataTable
          lazy
          dataKey="id"
          size="small"
          value={articlePageData.list}
          totalRecords={articlePageData.total}
          paginator
          first={first}
          rows={pageSize}
          rowsPerPageOptions={TABLE_PAGE_SIZE_OPTIONS}
          sortField={sortField}
          sortOrder={sortOrder}
          loading={isLoading}
          onPage={handlePageAndSortChange}
          onSort={handlePageAndSortChange}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} 至 {last} 总计 {totalRecords}"
          emptyMessage="暂无数据"
        >
          <Column field="title" header="标题" className="max-w-xs" />
          <Column field="author" header="作者" />
          <Column
            field="status"
            header="状态"
            body={ArticleStatusColumnBody}
            sortable
            sortField="status"
          />
          <Column
            field="categoryName"
            header="分类"
            sortable
            sortField="category_name"
          />
          <Column
            field="viewCount"
            header="浏览数"
            sortable
            sortField="view_count"
          />
          <Column
            field="isTop"
            header="置顶"
            body={(data: PageArticleItem) => (
              <InputSwitch
                checked={data.isTop}
                onChange={(e) => udpateIsTop(data.id, e.value, data.version)}
              />
            )}
            sortable
            sortField="is_top"
          />
          <Column
            field="isFire"
            header="精华"
            body={(data: PageArticleItem) => (
              <InputSwitch
                checked={data.isFire}
                onChange={(e) => updateIsFire(data.id, e.value, data.version)}
              />
            )}
            sortable
            sortField="is_fire"
          />
          <Column
            field="isDraft"
            header="草稿"
            body={(data) => (data.isDraft ? '是' : '否')}
            sortable
            sortField="is_draft"
          />
          <Column
            header="标签"
            body={(data: PageArticleItem) => (
              <div className="flex gap-3 flex-wrap">
                {data.tags &&
                  data.tags.map((tag) => (
                    <Tag
                      key={tag.id}
                      value={tag.tagName}
                      style={{ backgroundColor: `#${tag.color}` }}
                    />
                  ))}
              </div>
            )}
          />
          <Column
            field="updateTime"
            header="最近修改时间"
            body={(rowData) => <span>{toDateString(rowData.updateTime)}</span>}
          />
          <Column header="操作" body={actionBodyTemplate} frozen />
        </DataTable>
      </div>

      <ConfirmPopup />
    </div>
  );
}

export default ArticlePage;
