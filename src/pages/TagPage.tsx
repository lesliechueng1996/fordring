import { InputText } from 'primereact/inputtext';
import useTag from '../hooks/useTag';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CreateTimeColumnBody from '../components/CreateTimeColumnBody';
import { Sidebar } from 'primereact/sidebar';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { MouseEventHandler, useRef } from 'react';
import { TABLE_PAGE_SIZE_OPTIONS } from '../configs/constant';
import { TagPageItem } from '../apis/tag-api';
import useConfirmPopup from '../hooks/useConfirmPopup';
import useSidebarAction from '../hooks/useSidebarAction';
import CreateTag from '../components/tag/CreateTag';
import EditTag from '../components/tag/EditTag';
import useMount from '../hooks/useMount';

const ColorColumnBody = (rowData: TagPageItem) => {
  return (
    <span>
      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: `#${rowData.color}` }} />
    </span>
  );
};

function TagPage() {
  const {
    tagName,
    setTagName,
    isLoading,
    search,
    clear,
    tagPageData,
    first,
    pageSize,
    sortField,
    sortOrder,
    handlePageAndSortChange,
    deleteTag,
  } = useTag();
  const showConfirm = useConfirmPopup();

  const { showSidebar, showCreateSidebar, showEditSidebar, hideCreateSidebar, hideEditSidebar } = useSidebarAction();

  const editIdRef = useRef<number | null>(null);

  useMount(() => search());

  const confirmDelete: (rowData: TagPageItem) => MouseEventHandler<HTMLButtonElement> =
    (rowData: TagPageItem) => (event) => {
      showConfirm(event.currentTarget, () => {
        deleteTag(rowData.id);
      });
    };

  const handleEditClick = (editId: number) => () => {
    editIdRef.current = editId;
    showEditSidebar();
  };

  const actionBodyTemplate = (rowData: TagPageItem) => {
    return (
      <div className="space-x-3">
        <Button label="编辑" severity="help" onClick={handleEditClick(rowData.id)} />
        <Button label="删除" severity="danger" onClick={confirmDelete(rowData)} />
      </div>
    );
  };

  const handleHideEditSidebar = () => {
    editIdRef.current = null;
    hideEditSidebar();
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <span className="p-float-label">
            <InputText id="tagName" name="tagName" value={tagName} onChange={(e) => setTagName(e.target.value)} />
            <label htmlFor="tagName">标签名</label>
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
          value={tagPageData.list}
          totalRecords={tagPageData.total}
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
          <Column field="tagName" header="标签名" sortable sortField="tag_name" />
          <Column field="color" header="标签颜色" body={ColorColumnBody} />
          <Column field="createTime" header="创建时间" sortable sortField="create_time" body={CreateTimeColumnBody} />
          <Column header="操作" body={actionBodyTemplate} />
        </DataTable>
      </div>

      <Sidebar visible={showSidebar.create} onHide={hideCreateSidebar}>
        <CreateTag
          onSuccess={() => {
            hideCreateSidebar();
            search();
          }}
        />
      </Sidebar>

      <Sidebar visible={showSidebar.edit && editIdRef.current !== null} onHide={handleHideEditSidebar}>
        <EditTag
          id={editIdRef.current!}
          onSuccess={() => {
            handleHideEditSidebar();
            search();
          }}
        />
      </Sidebar>

      <ConfirmPopup />
    </div>
  );
}

export default TagPage;
