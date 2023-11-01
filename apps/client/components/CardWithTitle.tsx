import Card from './Card';
import { TrophyIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/solid';

type Props = {
  tip: string;
  icon: 'trophy' | 'fire';
} & Parameters<typeof Card>[0];

function CardWithTitle({ tip, icon, ...rest }: Props) {
  return (
    <div className="h-full relative group">
      <div className="absolute -top-1 left-12 rounded-lg p-1.5 pb-0 gradient-bg group-hover:-translate-y-8 transition-transform duration-500">
        <div className="text-label text-xs flex gap-1 bg-background py-2 px-3 rounded-lg">
          {icon === 'trophy' ? (
            <TrophyIcon className="w-4 h-4" />
          ) : (
            <FireIcon className="w-4 h-4" />
          )}
          <span>{tip}</span>
        </div>
      </div>
      <div className="absolute w-full rounded-2xl h-full group-hover:scale-[1.02] transition-transform duration-500 overflow-hidden">
        <Card {...rest} />
      </div>
    </div>
  );
}

export default CardWithTitle;
