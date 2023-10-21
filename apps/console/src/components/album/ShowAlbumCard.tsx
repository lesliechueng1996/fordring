import AlbumCard from './AlbumCard';
import DefaultBgImg from '../../assets/default-album-bg.jpg';
import { MouseEventHandler } from 'react';

type Props = {
  displayName: string;
  folderName: string;
  previewUrl: string | null;
  description: string | null;
  onContextMenuClick: MouseEventHandler<HTMLDivElement>;
  onClick: MouseEventHandler<HTMLDivElement>;
};

function ShowAlbumCard({ displayName, folderName, previewUrl, description, onContextMenuClick, onClick }: Props) {
  const PreviewImg = previewUrl ? (
    <img src={previewUrl} alt={displayName} />
  ) : (
    <img src={DefaultBgImg} alt={displayName} />
  );

  return (
    <div onContextMenu={onContextMenuClick}>
      <AlbumCard tip={description} onClick={onClick}>
        <div className="w-full h-full flex flex-col">
          <div className="grow">{PreviewImg}</div>
          <div className="text-center h-12 overflow-hidden shrink-0">
            <p>{displayName}</p>
            <p className="text-xs text-neutral-400">{folderName}/</p>
          </div>
        </div>
      </AlbumCard>
    </div>
  );
}

export default ShowAlbumCard;
