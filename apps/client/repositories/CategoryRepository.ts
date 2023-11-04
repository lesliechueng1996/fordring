import prisma from './prisma';

export function getCategoryCount() {
  return prisma.category.count();
}

export function getAllCategories() {
  return prisma.category.findMany();
}
