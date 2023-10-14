import { Sidebar } from 'primereact/sidebar';
import AddAlbumCard from '../components/album/AddAlbumCard';
import { MouseEventHandler, useRef } from 'react';
import CreateAlbum from '../components/album/CreateAlbum';
import useAlbum from '../hooks/useAlbum';
import ShowAlbumCard from '../components/album/ShowAlbumCard';
import useMount from '../hooks/useMount';
import { ContextMenu } from 'primereact/contextmenu';
import EditAlbum from '../components/album/EditAlbum';
import useSidebarAction from '../hooks/useSidebarAction';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

function AlbumPage() {
  const { showSidebar, showCreateSidebar, showEditSidebar, hideCreateSidebar, hideEditSidebar } = useSidebarAction();

  const contextMenuRef = useRef<ContextMenu>(null);
  const { albums, search, deleteAlbum } = useAlbum();
  const onContextId = useRef<number | null>(null);

  useMount(() => {
    search();
  });

  const handleOnDeleteClick = () => {
    confirmDialog({
      message: '是否确定删除此图册',
      header: '确认',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        deleteAlbum(onContextId.current!);
      },
    });
  };

  const items = [
    {
      label: '编辑',
      icon: 'pi pi-pencil',
      command: () => {
        showEditSidebar();
      },
    },
    {
      label: '删除',
      icon: 'pi pi-trash',
      command: handleOnDeleteClick,
    },
  ];

  const handleCreateAlbumSuccess = () => {
    search();
    hideCreateSidebar();
  };

  const handleEditAlbumSuccess = () => {
    search();
    hideEditSidebar();
  };

  const handleContextMenuClick: (id: number) => MouseEventHandler<HTMLDivElement> = (id: number) => (e) => {
    onContextId.current = id;
    contextMenuRef.current!.show(e);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-10">
        <AddAlbumCard onClick={showCreateSidebar} />
        {albums.map((album) => (
          <ShowAlbumCard key={album.id} {...album} onContextMenuClick={handleContextMenuClick(album.id)} />
        ))}
      </div>

      <ContextMenu ref={contextMenuRef} model={items} />

      <Sidebar visible={showSidebar.create} onHide={hideCreateSidebar}>
        <CreateAlbum onSuccess={handleCreateAlbumSuccess} />
      </Sidebar>

      <Sidebar visible={showSidebar.edit} onHide={hideEditSidebar}>
        <EditAlbum id={onContextId.current!} onEditSuccess={handleEditAlbumSuccess} />
      </Sidebar>

      <ConfirmDialog />
    </div>
  );
}

export default AlbumPage;
