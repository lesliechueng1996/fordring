import Link from 'next/link';
import StatisticsItem from './StatisticsItem';
import routes from '@/routes';

function AsideMenu() {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2">
        <div className="h-24 w-24 rounded-full bg-white"></div>
      </div>

      <div className="text-label font-bold text-4xl mb-2">Leslie</div>
      <div className="h-1.5 w-16 gradient-bg mb-5" />
      <p className="text-content-main mb-20">一个疯狂的coder</p>

      <div className="w-full flex justify-between mt-auto px-12 mb-10">
        <StatisticsItem title="文章" count={16} />
        <StatisticsItem title="分类" count={9} />
        <StatisticsItem title="标签" count={10} />
      </div>

      <div className="flex flex-col items-center gap-2 text-label">
        {routes.map((route) => (
          <Link key={route.path} className="cursor-pointer" href={route.path}>
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AsideMenu;
