import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { Prisma, Tag } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma.service';

@Injectable()
export class TagRepository extends AbstractRepository<Tag, number> {
  constructor(protected prisma: PrismaService) {
    super(prisma, 'tag');
  }

  async save(tag: Prisma.TagCreateInput) {
    return this.prisma.tag.create({
      data: tag,
    });
  }

  async exist({ where }: { where: Prisma.TagWhereInput }) {
    const count = await this.prisma.tag.count({ where });
    return count > 0;
  }

  async searchByPage(
    where: Prisma.TagWhereInput,
    take: number,
    skip: number,
    orderBy: Prisma.TagOrderByWithRelationInput,
  ) {
    return this.prisma.tag.findMany({
      where,
      take,
      skip,
      orderBy,
    });
  }

  async count(where: Prisma.TagWhereInput) {
    return this.prisma.tag.count({ where });
  }
}
