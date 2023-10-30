import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { Picture } from 'src/entities';
import { PrismaService } from 'src/providers/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PictureRepository extends AbstractRepository<Picture, number> {
  constructor(protected prisma: PrismaService) {
    super(prisma, 'picture');
  }

  async countByAlbumId(albumId: number) {
    return this.prisma.picture.count({
      where: {
        albumId,
      },
    });
  }

  async save(picture: Prisma.PictureCreateInput) {
    return this.prisma.picture.create({
      data: picture,
    });
  }

  async findByAlbumId(albumId: number) {
    return this.prisma.picture.findMany({
      where: {
        albumId,
      },
    });
  }
}
