import { Tooltip } from 'primereact/tooltip';
import { useRef, type ReactNode, MouseEventHandler } from 'react';

type Props = {
  children: ReactNode;
  tip: string | null;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

function AlbumCard({ children, tip, onClick }: Props) {
  const domRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={domRef}
        className="w-48 h-64 border rounded-md shadow hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer"
        data-pr-tooltip={tip || ''}
        onClick={onClick}
      >
        {children}
      </div>

      {tip && <Tooltip target={domRef} mouseTrack />}
    </>
  );
}

export default AlbumCard;
