import { useEffect, useState } from 'react';
import { AlbumPictureRes, AlbumPictureResItem, getAlbumPictures } from '../../apis/album-api';
import { API_OK } from '../../apis/http-request';

type Props = {
  albumId: number;
  onPicChoose: (picId: number, url: string) => void;
};

function PickAlbumPicture({ albumId, onPicChoose }: Props) {
  const [pictures, setPictures] = useState<AlbumPictureResItem[]>([]);

  useEffect(() => {
    getAlbumPictures(albumId).then((res) => {
      if (res.code !== API_OK) {
        setPictures([]);
        return;
      }

      const { data } = res as { data: AlbumPictureRes };
      setPictures(data.pictures);
    });
  }, [albumId]);

  return (
    <div className="flex flex-wrap gap-3">
      {pictures.map((pic) => (
        <div className="w-28 h-20 py-2" onClick={() => onPicChoose(pic.id, pic.url)}>
          <img key={pic.id} src={pic.url} alt={pic.name} />
        </div>
      ))}
    </div>
  );
}

export default PickAlbumPicture;
