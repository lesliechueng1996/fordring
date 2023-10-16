import type { AlbumPicture } from '../../hooks/useAlbumPicture';
import { Button } from 'primereact/button';
import type { MouseEvent } from 'react';
import useToast from '../../hooks/useToast';
import { Image } from 'primereact/image';

type Props = {
  picture: AlbumPicture;
  onDeleteClick: (id: number, event: MouseEvent<HTMLButtonElement>) => void;
  onShowRelatedArticlesClick: (id: number, event: MouseEvent<HTMLButtonElement>) => void;
};

function PictureItem({ picture, onDeleteClick, onShowRelatedArticlesClick }: Props) {
  const { id, name, url, createTime, description } = picture;
  const { success } = useToast();

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(url);
    success('图片链接已复制');
  };

  return (
    <div className="flex items-center gap-5 py-3">
      {/* <img src={url} alt={name} className="shrink-0 w-56 h-40 object-contain" /> */}
      <Image src={url} alt={name} className="shrink-0 flex w-56 h-40" preview />
      <div className="grow space-y-2">
        <div className="flex gap-3 items-center">
          <p className="font-bold">{name}</p>
          <i className="pi pi-copy cursor-pointer" onClick={handleCopyClick} />
        </div>
        <p className="text-xs text-neutral-400">{createTime}</p>
        <p className="text-xs">{description}</p>
      </div>
      <div className="shrink-0 flex flex-col gap-5">
        <Button icon="pi pi-book" label="查看关联文章" onClick={(e) => onShowRelatedArticlesClick(id, e)} />
        <Button icon="pi pi-trash" label="删除" onClick={(e) => onDeleteClick(id, e)} severity="danger" />
      </div>
    </div>
  );
}

export default PictureItem;
