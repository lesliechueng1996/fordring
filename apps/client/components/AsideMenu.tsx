import Link from 'next/link';
import StatisticsItem from './StatisticsItem';
import routes from '@/routes';
import { getUserBasicInfo } from '@/repositories/UserRepository';
import { getArticleCount } from '@/repositories/ArticleRepository';
import { getTagCount } from '@/repositories/TagRepository';
import { getCategoryCount } from '@/repositories/CategoryRepository';

async function AsideMenu() {
  const userId = '9947cdfc-cd47-442a-9a22-94b5d76a450a';

  const [user, articleCount, tagCount, categoryCount] = await Promise.all([
    getUserBasicInfo(userId),
    getArticleCount(),
    getTagCount(),
    getCategoryCount(),
  ]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2">
        <div className="h-24 w-24 rounded-full bg-white"></div>
      </div>

      <div className="text-label font-bold text-4xl mb-2">{user.nickName}</div>
      <div className="h-1.5 w-16 gradient-bg mb-5" />
      <p className="text-content-main mb-20">{user.description}</p>

      <div className="w-full flex justify-between mt-auto px-12 mb-10">
        <StatisticsItem title="文章" count={articleCount} />
        <StatisticsItem title="分类" count={categoryCount} />
        <StatisticsItem title="标签" count={tagCount} />
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
