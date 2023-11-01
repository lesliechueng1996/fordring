import prisma from './prisma';

const ArticleStatus = {
  HIDDEN: 0,
  SHOW: 1,
};

export function getArticleCount() {
  return prisma.article.count();
}

export function getArticleForBanner() {
  return prisma.article.findFirst({
    select: {
      title: true,
      content: true,
      previewUrl: true,
      author: true,
      updateTime: true,
      category: {
        select: {
          id: true,
          categoryName: true,
        },
      },
      tags: {
        select: {
          id: true,
          tagName: true,
          color: true,
        },
      },
    },
    where: {
      isTop: true,
      isDraft: false,
      status: ArticleStatus.SHOW,
    },
    orderBy: {
      updateTime: 'desc',
    },
  });
}
