import { Article } from 'src/entities';
import { AbstractRepository } from './abstract.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticleRepository extends AbstractRepository<Article, string> {
  constructor(protected prisma: PrismaService) {
    super(prisma, 'article');
  }

  async save(data: Prisma.ArticleCreateInput) {
    return this.prisma.article.create({
      data,
    });
  }

  async update(
    data: Prisma.ArticleUpdateInput,
    where: Prisma.ArticleWhereUniqueInput,
  ) {
    return this.prisma.article.update({
      data,
      where,
    });
  }

  async findUnique(
    where: Prisma.ArticleWhereUniqueInput,
    include: Prisma.ArticleInclude,
  ) {
    return this.prisma.article.findUnique({
      where,
      include,
    });
  }

  deleteRelatedTagsAndPictures(articleId: string) {
    return this.prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        tags: {
          set: [],
        },
        pictures: {
          set: [],
        },
      },
    });
  }

  deleteArticle(articleId: string) {
    return this.prisma.article.delete({
      where: {
        id: articleId,
      },
    });
  }

  getArticlePrisma() {
    return this.prisma.article;
  }
}
