import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/entities/article.entity';
import { ArticlePicture } from 'src/entities/article-picture.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Article, ArticlePicture])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
