import prisma from './prisma';

export async function getUserBasicInfo(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return {
    nickName: user?.nickName ?? 'User',
    avatarUrl: user?.avatarUrl ?? '',
    description: user?.description ?? '',
  };
}
