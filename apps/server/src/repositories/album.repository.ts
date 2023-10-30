import { Album } from 'src/entities';
import { AbstractRepository } from './abstract.repository';
import { PrismaService } from 'src/providers/prisma.service';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AlbumRepository extends AbstractRepository<Album, number> {
  constructor(protected prisma: PrismaService) {
    super(prisma, 'album');
  }

  async count(where: Prisma.AlbumWhereInput) {
    return this.prisma.album.count({
      where,
    });
  }

  async save(data: Prisma.AlbumCreateInput) {
    return this.prisma.album.create({
      data,
    });
  }

  async findAllOrderByCreateTimeDesc() {
    return this.prisma.album.findMany({
      orderBy: {
        createTime: 'desc',
      },
    });
  }

  getAlbumPrisma() {
    return this.prisma.album;
  }
}
