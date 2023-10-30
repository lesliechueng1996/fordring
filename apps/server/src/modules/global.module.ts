import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma.service';
import { AlbumRepository } from '../repositories/album.repository';
import { ArticleRepository } from '../repositories/article.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { PictureRepository } from '../repositories/picture.repository';
import { TagRepository } from '../repositories/tag.repository';
import { UserRepository } from '../repositories/user.repository';
import { QiniuService } from 'src/providers/qiniu.service';

@Global()
@Module({
  providers: [
    QiniuService,
    PrismaService,
    AlbumRepository,
    ArticleRepository,
    CategoryRepository,
    PictureRepository,
    TagRepository,
    UserRepository,
  ],
  exports: [
    QiniuService,
    PrismaService,
    AlbumRepository,
    ArticleRepository,
    CategoryRepository,
    PictureRepository,
    TagRepository,
    UserRepository,
  ],
})
export class GlobalModule {}
