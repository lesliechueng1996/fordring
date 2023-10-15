import { useParams } from 'react-router-dom';
import useAlbumPicture from '../hooks/useAlbumPicture';
import DefaultAlbumImg from '../assets/default-album-bg.jpg';
import CardSkeleton from '../components/CardSkeleton';
import useMount from '../hooks/useMount';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import useSidebarAction from '../hooks/useSidebarAction';
import AddNewPicture from '../components/picture/AddNewPicture';

function AlbumPicturePage() {
  const { albumId } = useParams();
  const { album, loadAlbum } = useAlbumPicture(Number(albumId));
  const { showSidebar, showCreateSidebar, hideCreateSidebar } = useSidebarAction();

  useMount(() => {
    loadAlbum();
  });

  const AlbumPreview = album?.previewUrl ? (
    <img className="h-full" src={album.previewUrl} alt={album.displayName} />
  ) : (
    <img className="h-full" src={DefaultAlbumImg} alt={album?.displayName} />
  );

  const handleAddPicture = () => {
    showCreateSidebar();
  };

  return (
    <div>
      {album ? (
        <>
          <div className="h-60 border shadow-md py-5 px-10 flex gap-10">
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
          <div></div>
        </>
      ) : (
        <CardSkeleton />
      )}

      <Sidebar visible={showSidebar.create} onHide={hideCreateSidebar}>
        <AddNewPicture />
      </Sidebar>
    </div>
  );
}

export default AlbumPicturePage;
