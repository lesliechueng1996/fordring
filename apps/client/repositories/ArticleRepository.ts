import prisma from './prisma';

export function getArticleCount() {
  return prisma.article.count();
}
