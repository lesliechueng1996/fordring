import { InputText } from 'primereact/inputtext';
import useCategory from '../hooks/useCategory';
import { MouseEventHandler, useState } from 'react';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import CreateCategory from '../components/category/CreateCategory';
import EditCategory from '../components/category/EditCategory';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TABLE_PAGE_SIZE_OPTIONS } from '../configs/constant';
import useMount from '../hooks/useMount';
import { CategoryPageItem } from '../apis/category-api';
import toDateString from '../utils/toDateString';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

const createTimeBodyTemplate = (rowData: CategoryPageItem) => {
  return <span>{toDateString(rowData.createTime)}</span>;
};

function CategoryPage() {
  console.log('CategoryPage render');

  const {
    search,
    isLoading,
    categoryPageData,
    pageSize,
    first,
    sortField,
    sortOrder,
    handlePageAndSortChange,
    categoryName,
    setCategoryName,
    clear,
    deleteCategory,
  } = useCategory();

  const [showSidebar, setShowSidebar] = useState({
    create: false,
    edit: false,
  });

  const [editId, setEditId] = useState<number | null>(null);

  useMount(() => search());

  const showCreateSidebar = () => setShowSidebar({ ...showSidebar, create: true });

  const showEditSidebar = (editId: number) => {
    setEditId(editId);
    setShowSidebar({ ...showSidebar, edit: true });
  };

  const hideCreateSidebar = () => setShowSidebar({ ...showSidebar, create: false });

  const hideEditSidebar = () => {
    setEditId(null);
    setShowSidebar({ ...showSidebar, edit: false });
  };

  const confirmDelete: (rowData: CategoryPageItem) => MouseEventHandler<HTMLButtonElement> =
    (rowData: CategoryPageItem) => (event) => {
      confirmPopup({
        target: event.currentTarget,
        message: '确认删除此分类?',
        icon: 'pi pi-info-circle',
        acceptClassName: 'p-button-danger',
        acceptLabel: '删除',
        rejectLabel: '取消',
        accept: () => {
          deleteCategory(rowData.id);
        },
      });
    };

  const actionBodyTemplate = (rowData: CategoryPageItem) => {
    return (
      <div className="space-x-3">
        <Button label="编辑" severity="help" onClick={() => showEditSidebar(rowData.id)} />
        <Button label="删除" severity="danger" onClick={confirmDelete(rowData)} />
      </div>
    );
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <span className="p-float-label">
            <InputText
              id="categoryName"
              name="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <label htmlFor="categoryName">类别名</label>
          </span>

          <Button label="搜索" icon="pi pi-search" loading={isLoading} onClick={() => search()} />
          <Button label="清除" icon="pi pi-filter-slash" severity="warning" onClick={clear} />
        </div>

        <div>
          <Button label="新增" icon="pi pi-plus" severity="success" onClick={showCreateSidebar} />
        </div>
      </div>
      <div>
        <DataTable
          lazy
          dataKey="id"
          size="small"
          value={categoryPageData.list}
          totalRecords={categoryPageData.total}
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
          <Column field="categoryName" header="分类名" sortable sortField="category_name" />
          <Column field="createTime" header="创建时间" sortable sortField="create_time" body={createTimeBodyTemplate} />
          <Column header="操作" body={actionBodyTemplate} />
        </DataTable>
      </div>

      <Sidebar visible={showSidebar.create} onHide={hideCreateSidebar}>
        <CreateCategory
          onSuccess={() => {
            hideCreateSidebar();
            search();
          }}
        />
      </Sidebar>

      <Sidebar visible={showSidebar.edit && editId !== null} onHide={hideEditSidebar}>
        <EditCategory
          id={editId!}
          onSuccess={() => {
            hideEditSidebar();
            search();
          }}
        />
      </Sidebar>

      <ConfirmPopup />
    </div>
  );
}

export default CategoryPage;
