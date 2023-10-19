import { useState } from 'react';
import PickAlbum, { Album } from './PickAlbum';
import AddNewPicture from '../picture/AddNewPicture';

type Props = {
  onSuccess: (picInfo: { albumId: number; picId: number; url: string }) => void;
};

function UploadPic({ onSuccess }: Props) {
  const [album, setAlbum] = useState<Album>();

  return (
    <div className="space-y-10">
      <PickAlbum onAlbumChoose={setAlbum} />
      {album && (
        <AddNewPicture
          title={`上传图片到【${album.albumName}】`}
          albumId={album.albumId}
          onSuccess={(id, url) => {
            onSuccess({
              albumId: album.albumId,
              picId: id,
              url,
            });
          }}
        />
      )}
    </div>
  );
}

export default UploadPic;
