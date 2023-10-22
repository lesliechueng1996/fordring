import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { ARTICLE_IMAGE_PREFIX } from 'src/constants/fordring.const';
import { DataSource, Repository } from 'typeorm';
import { Article, ArticleStatus } from 'src/entities/article.entity';
import { ArticlePicture } from 'src/entities/article-picture.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveArticleDtoReq } from './dto/save-article.dto';
import { ArticleTag } from 'src/entities/article-tag.entity';

@Injectable()
export class ArticleService {
  private readonly logger: Logger = new Logger(ArticleService.name);

  constructor(
    private dataSource: DataSource,
    @InjectRepository(Article) private articleRepository: Repository<Article>
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

      this.logger.log(`save draft article ${article.id}`);

      const articlePictures = Object.keys(images).map((id) => ({
        articleId: article.id,
        pictureId: parseInt(id),
      }));

      if (articlePictures.length > 0) {
        await queryRunner.manager.save(ArticlePicture, articlePictures);
        this.logger.log(
          `save draft article ${article.id} pictures, size: ${articlePictures.length}`
        );
      }
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

  async updateDraftArticle(id: string, title: string, content: string) {
    const images = this.collectImageFromArticle(content);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(
        Article,
        {
          id,
        },
        {
          title,
          content,
          status: ArticleStatus.HIDDEN,
          isDraft: true,
        }
      );
      this.logger.log(`update draft article ${id}`);

      const articlePictures = Object.keys(images).map((pid) => ({
        articleId: id,
        pictureId: parseInt(pid),
      }));

      await queryRunner.manager.delete(ArticlePicture, {
        articleId: id,
      });
      this.logger.log(`delete draft article ${id} pictures`);

      if (articlePictures.length > 0) {
        await queryRunner.manager.save(ArticlePicture, articlePictures);
        this.logger.log(
          `save draft article ${id} pictures, size: ${articlePictures.length}`
        );
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getArticleById(id: string) {
    return this.articleRepository.findOneBy({ id });
  }

  async saveArticle(body: SaveArticleDtoReq, user: User) {
    const { nickName } = user;
    const {
      title,
      content,
      status,
      categoryId,
      previewUrl,
      isTop,
      isFire,
      tagIds,
    } = body;

    const images = this.collectImageFromArticle(content);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const article = await queryRunner.manager.save(Article, {
        title,
        author: nickName,
        content,
        status,
        categoryId,
        viewCount: 0,
        previewUrl,
        isTop,
        isFire,
        isDraft: false,
      });

      this.logger.log(`save article ${article.id}`);

      const articlePictures = Object.keys(images).map((id) => ({
        articleId: article.id,
        pictureId: parseInt(id),
      }));

      await queryRunner.manager.delete(ArticlePicture, {
        articleId: article.id,
      });
      this.logger.log(`delete article ${article.id} pictures`);

      if (articlePictures.length > 0) {
        await queryRunner.manager.save(ArticlePicture, articlePictures);
        this.logger.log(
          `save article ${article.id} pictures, size: ${articlePictures.length}`
        );
      }

      if (tagIds.length > 0) {
        await queryRunner.manager.save(
          ArticleTag,
          tagIds.map((tagId) => ({
            articleId: article.id,
            tagId,
          }))
        );
        this.logger.log(
          `save article ${article.id} tags, size: ${tagIds.length}`
        );
      }

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
      `!\\[${ARTICLE_IMAGE_PREFIX}(\\d+)\\]\\((.*?)\\)`,
      'g'
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
