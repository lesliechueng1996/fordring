import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { ARTICLE_IMAGE_PREFIX } from 'src/constants/fordring.const';
import { DataSource, Repository } from 'typeorm';
import { Article, ArticleStatus } from 'src/entities/article.entity';
import { ArticlePicture } from 'src/entities/article-picture.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveArticleDtoReq } from './dto/save-article.dto';
import { ArticleTag } from 'src/entities/article-tag.entity';
import { PageArticleDtoReq, PageArticleResItem } from './dto/page-article.dto';
import { Category } from 'src/entities/category.entity';
import { withPageAndOrderQuery } from 'src/utils/query-builder.util';
import { Tag } from 'src/entities/tag.entity';
import { BaseEntity } from 'src/entities/base.entity';
import { ApiJsonResult } from 'src/dto/api-json-result.dto';
import { ARTICLE_ERROR } from 'src/constants/error.const';

@Injectable()
export class ArticleService {
  private readonly logger: Logger = new Logger(ArticleService.name);

  constructor(
    private dataSource: DataSource,
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @InjectRepository(ArticleTag)
    private articleTagRepository: Repository<ArticleTag>
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

  async getArticlesByPage(query: PageArticleDtoReq) {
    const {
      title,
      status,
      categoryId,
      tagId,
      isTop,
      isFire,
      isDraft,
      currentPage,
      pageSize,
      sortField,
      sortOrder,
    } = query;
    let queryBuilder = this.dataSource
      .createQueryBuilder()
      .select('article.id', 'id')
      .addSelect('title')
      .addSelect('author')
      .addSelect('status')
      .addSelect('category.category_name', 'category_name')
      .addSelect('view_count')
      .addSelect('preview_url')
      .addSelect('is_top')
      .addSelect('is_fire')
      .addSelect('is_draft')
      .addSelect('article.version', 'version')
      .addSelect('article.update_time', 'update_time')
      .from(Article, 'article')
      .leftJoin(Category, 'category', 'article.category_id = category.id');

    if (title) {
      queryBuilder = queryBuilder.andWhere('article.title like :title', {
        title: `%${title}%`,
      });
    }

    if (status !== undefined) {
      queryBuilder = queryBuilder.andWhere('article.status = :status', {
        status,
      });
    }

    if (categoryId !== undefined) {
      queryBuilder = queryBuilder.andWhere(
        'article.category_id = :categoryId',
        {
          categoryId,
        }
      );
    }

    if (tagId !== undefined) {
      const articleIdSet: {
        articleId: string;
      }[] = await this.articleTagRepository
        .createQueryBuilder()
        .select('distinct article_id', 'articleId')
        .where('tag_id = :tagId', { tagId })
        .getRawMany();

      queryBuilder = queryBuilder.andWhere('article.id in (:...articleIdSet)', {
        articleIdSet: articleIdSet.map((item) => item.articleId),
      });
    }

    if (isTop !== undefined) {
      queryBuilder = queryBuilder.andWhere('article.is_top = :isTop', {
        isTop,
      });
    }

    if (isFire !== undefined) {
      queryBuilder = queryBuilder.andWhere('article.is_fire = :isFire', {
        isFire,
      });
    }

    if (isDraft !== undefined) {
      queryBuilder = queryBuilder.andWhere('article.is_draft = :isDraft', {
        isDraft,
      });
    }

    const countQueryBuilder = queryBuilder.clone();

    let newQueryBuilder = this.dataSource
      .createQueryBuilder()
      .select('id')
      .addSelect('title')
      .addSelect('author')
      .addSelect('status')
      .addSelect('category_name', 'categoryName')
      .addSelect('view_count', 'viewCount')
      .addSelect('preview_url', 'previewUrl')
      .addSelect('is_top', 'isTop')
      .addSelect('is_fire', 'isFire')
      .addSelect('is_draft', 'isDraft')
      .addSelect('version', 'version')
      .addSelect('update_time', 'updateTime')
      .from('(' + queryBuilder.getQuery() + ')', 't')
      .setParameters(queryBuilder.getParameters());

    newQueryBuilder = withPageAndOrderQuery(
      newQueryBuilder,
      currentPage,
      pageSize,
      sortField,
      sortOrder
    );

    const [articleList, total] = await Promise.all([
      newQueryBuilder.getRawMany() as Promise<
        Omit<PageArticleResItem, 'tags'>[]
      >,
      countQueryBuilder.getCount(),
    ]);

    const currentPageArticleIds = articleList.map((item) => item.id);

    const tagsQueryBuilder = this.dataSource
      .createQueryBuilder()
      .select('article_tag.article_id', 'articleId')
      .addSelect('tag.id', 'id')
      .addSelect('tag.tag_name', 'tagName')
      .addSelect('tag.color', 'color')
      .from(ArticleTag, 'article_tag')
      .leftJoin(Tag, 'tag', 'article_tag.tag_id = tag.id')
      .where('article_tag.article_id in (:...articleIds)', {
        articleIds: currentPageArticleIds,
      });

    const tags: Array<Omit<Tag, keyof BaseEntity> & { articleId: string }> =
      await tagsQueryBuilder.getRawMany();

    const tagMap = tags.reduce((acc, cur) => {
      const { articleId, ...tag } = cur;
      if (!acc[articleId]) {
        acc[articleId] = [];
      }
      acc[articleId].push(tag);
      return acc;
    }, {} as { [key: string]: Array<Omit<Tag, keyof BaseEntity>> });

    const pageArticleList = articleList.map((item) => ({
      ...item,
      tags: tagMap[item.id] || [],
    }));

    return {
      total,
      list: pageArticleList,
    };
  }

  async deleteArticleById(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // delete article
      await queryRunner.manager.delete(Article, {
        id,
      });

      // delete article picture
      await queryRunner.manager.delete(ArticlePicture, {
        articleId: id,
      });

      // delete article tag
      await queryRunner.manager.delete(ArticleTag, {
        articleId: id,
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateArticleFlag(
    articleId: string,
    flagKey: 'isTop' | 'isFire' | 'isDraft',
    value: boolean,
    version: number
  ) {
    const result = await this.articleRepository.update(
      {
        id: articleId,
        version,
      },
      {
        [flagKey]: value,
      }
    );
    if (result.affected === 0) {
      throw new ConflictException(
        ApiJsonResult.error(
          ARTICLE_ERROR.ARTICLE_VERSION_CONFLICT,
          'Article version conflict'
        )
      );
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
