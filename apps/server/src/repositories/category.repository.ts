import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma.service';

@Injectable()
export class CategoryRepository extends AbstractRepository<Category, number> {
  constructor(protected prisma: PrismaService) {
    super(prisma, 'category');
  }

  async countByCategoryName(categoryName: string) {
    return await this.prisma.category.count({
      where: {
        categoryName,
      },
    });
  }

  async save(data: Prisma.CategoryCreateInput) {
    return await this.prisma.category.create({
      data,
    });
  }

  async searchByPage(
    where: Prisma.CategoryWhereInput,
    take: number,
    skip: number,
    orderBy: Prisma.CategoryOrderByWithRelationInput,
  ) {
    return await this.prisma.category.findMany({
      where,
      take,
      skip,
      orderBy,
    });
  }

  async count(where: Prisma.CategoryWhereInput) {
    return await this.prisma.category.count({
      where,
    });
  }
}
