import { getArticleForBanner } from '@/repositories/ArticleRepository';
import CardWithTitle from './CardWithTitle';

async function AppBanner() {
  const articleBannerInfo = await getArticleForBanner();
  if (!articleBannerInfo) {
    return null;
  }

  const {
    id,
    title,
    content,
    author,
    category,
    previewUrl,
    tags = [],
    updateTime,
  } = articleBannerInfo;
  const categoryName = category?.categoryName || '无分类';

  return (
    <section className="h-96 lg:h-[30rem]">
      <CardWithTitle
        tip="置顶"
        icon="trophy"
        id={id}
        label={categoryName}
        labelComments={tags}
        previewUrl={previewUrl}
        title={title}
        content={content}
        avatarName={author}
        time={updateTime}
      />
    </section>
  );
}

export default AppBanner;
