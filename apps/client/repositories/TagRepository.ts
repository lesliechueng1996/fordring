import prisma from './prisma';

export function getTagCount() {
  return prisma.tag.count();
}
