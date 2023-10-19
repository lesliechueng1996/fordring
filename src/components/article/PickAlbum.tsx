import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';
import useMount from '../../hooks/useMount';
import { getAlbumOptions } from '../../apis/album-api';
import { API_OK } from '../../apis/http-request';
import { Sidebar } from 'primereact/sidebar';
import useSidebarAction from '../../hooks/useSidebarAction';
import CreateAlbum from '../album/CreateAlbum';

export type Album = {
  albumId: number;
  albumName: string;
};

type Props = {
  onAlbumChoose: (album: Album) => void;
};

function PickAlbum({ onAlbumChoose }: Props) {
  const [albums, setAlbums] = useState<DropdownOption[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const { showSidebar, showCreateSidebar, hideCreateSidebar } = useSidebarAction();

  useMount(() => {
    loadAlbums();
  });

  const loadAlbums = () => {
    getAlbumOptions().then((res) => {
      if (res.code === API_OK) {
        setAlbums(res.data as DropdownOption[]);
      } else {
        setSelectedAlbum('');
        setAlbums([]);
      }
    });
  };

  const handleChooseAlbum = () => {
    if (!selectedAlbum) {
      return;
    }

    const albumId = parseInt(selectedAlbum);
    const name = albums.find((album) => album.value === selectedAlbum)?.label ?? '';
    onAlbumChoose({
      albumId,
      albumName: name,
    });
  };

  const handleCreateAlbumSuccess = (id: number) => {
    hideCreateSidebar();
    loadAlbums();
    setSelectedAlbum(id.toString());
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <Dropdown
          className="grow"
          value={selectedAlbum}
          onChange={(e) => setSelectedAlbum(e.value)}
          options={albums}
          placeholder="选择图册"
          filter
        />
        <Button rounded className="shrink-0" icon="pi pi-plus" aria-label="New Album" onClick={showCreateSidebar} />
        <Button
          severity="success"
          rounded
          className="shrink-0"
          icon="pi pi-check"
          aria-label="Load Pictures"
          onClick={handleChooseAlbum}
        />
      </div>

      <Sidebar visible={showSidebar.create} onHide={hideCreateSidebar}>
        <CreateAlbum onSuccess={handleCreateAlbumSuccess} />
      </Sidebar>
    </div>
  );
}

export default PickAlbum;
