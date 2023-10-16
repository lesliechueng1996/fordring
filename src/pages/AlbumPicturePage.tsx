import { useParams } from 'react-router-dom';
import useAlbumPicture from '../hooks/useAlbumPicture';
import DefaultAlbumImg from '../assets/default-album-bg.jpg';
import CardSkeleton from '../components/CardSkeleton';
import useMount from '../hooks/useMount';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import useSidebarAction from '../hooks/useSidebarAction';
import AddNewPicture from '../components/picture/AddNewPicture';
import { DataScroller } from 'primereact/datascroller';
import PictureItem from '../components/picture/PictureItem';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { useRef, MouseEvent } from 'react';
import useConfirmPopup from '../hooks/useConfirmPopup';

function AlbumPicturePage() {
  const { albumId } = useParams();
  const albumIdNum = Number(albumId);
  const { album, loadAlbum, pictures, loadPictures, removePicture } = useAlbumPicture(albumIdNum);
  const { showSidebar, showCreateSidebar, hideCreateSidebar } = useSidebarAction();
  const opRef = useRef<OverlayPanel>(null);
  const showConfirm = useConfirmPopup();

  useMount(() => {
    loadAlbum();
    loadPictures();
  });

  const AlbumPreview = album?.previewUrl ? (
    <img className="h-full" src={album.previewUrl} alt={album.displayName} />
  ) : (
    <img className="h-full" src={DefaultAlbumImg} alt={album?.displayName} />
  );

  const handleAddPicture = () => {
    showCreateSidebar();
  };

  const handleAddPictureSuccess = () => {
    loadPictures();
    hideCreateSidebar();
  };

  const handleDeleteConfirm = (pictureId: number, event: MouseEvent<HTMLButtonElement>) => {
    showConfirm(event.currentTarget, () => removePicture(pictureId));
  };

  const handleShowRelatedArticlesClick = (_: number, event: MouseEvent<HTMLButtonElement>) => {
    opRef.current?.toggle(event);
  };

  return (
    <div>
      {album ? (
        <>
          <div className="h-60 border shadow-md py-5 px-10 flex gap-10 mb-10">
            <div className="w-40 h-full rounded-md overflow-hidden shadow-md border shrink-0">{AlbumPreview}</div>
            <div className="space-y-3 grow">
              <div className="flex gap-3">
                <p className="text-neutral-400">图册名称:</p>
                <p className="font-bold">{album.displayName}</p>
              </div>
              <div className="flex gap-3">
                <p className="text-neutral-400">图册文件夹路径:</p>
                <p className="font-bold">{album.folderName}/</p>
              </div>
              <div className="flex gap-3 items-start">
                <p className="shrink-0 text-neutral-400">图册描述:</p>
                <p className="font-bold">{album.description}</p>
              </div>
            </div>
            <div className="shrink-0">
              <Button icon="pi pi-plus" severity="success" aria-label="新增图片" rounded onClick={handleAddPicture} />
            </div>
          </div>
          <div>
            <DataScroller
              value={pictures}
              rows={5}
              inline
              header="向下滚动以加载更多"
              emptyMessage="无数据"
              itemTemplate={(picture) => (
                <PictureItem
                  key={picture.id}
                  picture={picture}
                  onDeleteClick={handleDeleteConfirm}
                  onShowRelatedArticlesClick={handleShowRelatedArticlesClick}
                />
              )}
            />

            <ConfirmPopup />
            <OverlayPanel ref={opRef}>
              {/* TODO: articles */}
              <div>敬请期待...</div>
            </OverlayPanel>
          </div>
        </>
      ) : (
        <CardSkeleton />
      )}

      <Sidebar visible={showSidebar.create} onHide={hideCreateSidebar}>
        <AddNewPicture albumId={albumIdNum} onSuccess={handleAddPictureSuccess} />
      </Sidebar>
    </div>
  );
}

export default AlbumPicturePage;
