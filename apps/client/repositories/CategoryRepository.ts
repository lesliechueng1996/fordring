import prisma from './prisma';

export function getCategoryCount() {
  return prisma.category.count();
}
