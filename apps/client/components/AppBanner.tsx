import { getArticleForBanner } from '@/repositories/ArticleRepository';
import CardWithTitle from './CardWithTitle';
import formatChineseDate from '@/utils/formatChineseDate';

async function AppBanner() {
  const articleBannerInfo = await getArticleForBanner();
  if (!articleBannerInfo) {
    return null;
  }

  const {
    title,
    content,
    author,
    category,
    previewUrl,
    tags = [],
    updateTime,
  } = articleBannerInfo;
  const categoryName = category?.categoryName || '无分类';
  const latestPublishDate = formatChineseDate(updateTime);

  return (
    <section className="h-96 lg:h-[30rem]">
      <CardWithTitle
        tip="置顶"
        icon="trophy"
        label={categoryName}
        labelComments={tags}
        previewUrl={previewUrl}
        title={title}
        content={content}
        avatarName={author}
        time={latestPublishDate}
      />
    </section>
  );
}

export default AppBanner;
