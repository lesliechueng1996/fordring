import { FireIcon } from '@heroicons/react/24/solid';

function RecommendBanner() {
  return (
    <div className="gradient-bg rounded-2xl p-1.5">
      <div className="bg-background rounded-2xl px-10 py-20 lg:px-8 lg:pt-40 lg:pb-[5.5rem]">
        <div className="gradient-text text-3xl inline-flex lg:text-4xl gap-5 mb-3 lg:flex-col lg:gap-0">
          <span>EDITOR&apos;S</span>
          <span>SELECTION</span>
        </div>
        <div className="text-label flex gap-2 text-2xl font-bold items-center">
          <FireIcon className="w-8 h-8" />
          <span>推荐文章</span>
        </div>
      </div>
    </div>
  );
}

export default RecommendBanner;
