type Props = {
  title: string;
  count: number;
};

function StatisticsItem({ title, count }: Props) {
  return (
    <div className="flex flex-col items-center gap-1 text-lg">
      <span className="text-label">{count}</span>
      <span className="text-content-main text-sm">{title}</span>
    </div>
  );
}

export default StatisticsItem;
