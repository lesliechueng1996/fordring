export { User, Album, Article, Category, Picture, Tag } from '@prisma/client';

export type BaseEntity = {
  createTime: Date;
  updateTime: Date;
  version: number;
};
