import AlbumCard from './AlbumCard';

type Props = {
  onClick: () => void;
};

function AddAlbumCard({ onClick }: Props) {
  return (
    <AlbumCard tip="新增图册" onClick={onClick}>
      <div className="flex items-center justify-center h-full">
        <i className="pi pi-plus text-5xl text-neutral-300" />
      </div>
    </AlbumCard>
  );
}

export default AddAlbumCard;
