import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { ARTICLE_IMAGE_PREFIX } from 'src/constants/fordring.const';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Article, ArticleStatus } from 'src/entities/article.entity';
import { ArticlePicture } from 'src/entities/article-picture.entity';

@Injectable()
export class ArticleService {
  private readonly logger: Logger = new Logger(ArticleService.name);

  constructor(
    private dataSource: DataSource,
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @InjectRepository(ArticlePicture)
    private articlePictureRepository: Repository<ArticlePicture>,
  ) {}

  async saveDraftArticle(title: string, content: string, user: User) {
    const { nickName } = user;
    const images = this.collectImageFromArticle(content);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const article = await queryRunner.manager.save(Article, {
        title,
        author: nickName,
        content,
        status: ArticleStatus.HIDDEN,
        categoryId: null,
        viewCount: 0,
        previewUrl: null,
        isTop: false,
        isFire: false,
        isDraft: true,
      });

      const articlePictures = Object.keys(images).map((id) => ({
        articleId: article.id,
        pictureId: parseInt(id),
      }));

      await queryRunner.manager.save(ArticlePicture, articlePictures);

      await queryRunner.commitTransaction();

      return article;
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Collect images from article, image link like '![${ARTICLE_IMAGE_PREFIX}${picId}](${url})'
   *
   * @param content Article content
   */
  collectImageFromArticle(content: string): {
    [key: string]: string;
  } {
    const reg = new RegExp(
      `\!\\[${ARTICLE_IMAGE_PREFIX}(\\d+)\\]\\((.*?)\\)`,
      'g',
    );
    const images = {};
    let result;
    while ((result = reg.exec(content))) {
      const [, id, url] = result;
      images[id] = url;
    }
    return images;
  }
}
