import { useState } from 'react';
import PickAlbum, { Album } from './PickAlbum';
import PickAlbumPicture from './PickAlbumPicture';

type Props = {
  onSuccess: (picInfo: { albumId: number; picId: number; url: string }) => void;
};

function PickExistingPic({ onSuccess }: Props) {
  const [album, setAlbum] = useState<Album>();

  return (
    <div className="space-y-10">
      <PickAlbum onAlbumChoose={setAlbum} />
      {album && (
        <PickAlbumPicture
          albumId={album.albumId}
          onPicChoose={(picId, url) => {
            onSuccess({
              albumId: album.albumId,
              picId,
              url,
            });
          }}
        />
      )}
    </div>
  );
}

export default PickExistingPic;
