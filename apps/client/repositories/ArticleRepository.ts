import { Prisma } from '@prisma/client';
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
      id: true,
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

export function getArticlesForRecommend(top: number = 2) {
  return prisma.article.findMany({
    select: {
      id: true,
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
      isTop: false,
      isFire: true,
      isDraft: false,
      status: ArticleStatus.SHOW,
    },
    orderBy: {
      updateTime: 'desc',
    },
    take: top,
  });
}

export function getArticleForPage(
  categoryId: number | null,
  lastId: string,
  limit: number = 10,
) {
  const where: Prisma.ArticleWhereInput = {};
  console.log(categoryId, lastId, limit);
  if (categoryId !== null) {
    where.categoryId = categoryId;
  }
  if (lastId !== '') {
    where.id = {
      lt: lastId,
    };
  }
  return prisma.article.findMany({
    select: {
      id: true,
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
      ...where,
      isDraft: false,
      status: ArticleStatus.SHOW,
    },
    orderBy: {
      id: 'desc',
    },
    take: limit,
  });
}
