import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/entities';
import {
  ARTICLE_IMAGE_PREFIX,
  PRISMA_ERROR,
} from 'src/constants/fordring.const';
import { Article } from 'src/entities';
import { ArticleStatus } from 'src/constants/fordring.const';
import { SaveArticleDtoReq } from './dto/save-article.dto';
import { PageArticleDtoReq } from './dto/page-article.dto';
import { ApiJsonResult } from 'src/dto/api-json-result.dto';
import { ARTICLE_ERROR } from 'src/constants/error.const';
import { GetArticleResDto } from './dto/get-article.dto';
import { UpdateArticleDtoReq } from './dto/update-article.dto';
import { ArticleRepository } from 'src/repositories/article.repository';
import { Prisma } from '@prisma/client';
import { generatePageAndOrderQuery } from 'src/utils/query-builder.util';

@Injectable()
export class ArticleService {
  private readonly logger: Logger = new Logger(ArticleService.name);

  constructor(private articleRepository: ArticleRepository) {}

  async saveDraftArticle(title: string, content: string, user: User) {
    const { nickName } = user;
    const images = this.collectImageFromArticle(content);

    return await this.articleRepository.save({
      title,
      author: nickName,
      content,
      status: ArticleStatus.HIDDEN,
      viewCount: 0,
      previewUrl: null,
      isTop: false,
      isFire: false,
      isDraft: true,
      pictures: {
        connect: Object.keys(images).map((id) => ({
          id: parseInt(id),
        })),
      },
    });
  }

  async updateDraftArticle(id: string, title: string, content: string) {
    const images = this.collectImageFromArticle(content);
    await this.articleRepository.update(
      {
        title,
        content,
        status: ArticleStatus.HIDDEN,
        isDraft: true,
        pictures: {
          set: [],
          connect: Object.keys(images).map((id) => ({
            id: parseInt(id),
          })),
        },
      },
      {
        id,
      },
    );
  }

  async getArticleById(id: string) {
    return this.articleRepository.findById(id);
  }

  async getArticleWithTagsById(id: string): Promise<GetArticleResDto> {
    const article = await this.articleRepository.findUnique(
      {
        id,
      },
      {
        tags: {
          select: {
            id: true,
          },
        },
      },
    );

    if (!article) {
      throw new NotFoundException(
        ApiJsonResult.error(
          ARTICLE_ERROR.ARTICLE_NOT_FOUND,
          'Article not found',
        ),
      );
    }

    return {
      id: article.id,
      title: article.title,
      author: article.author,
      content: article.content,
      status: article.status,
      categoryId: article.categoryId,
      previewUrl: article.previewUrl,
      isTop: article.isTop,
      isFire: article.isFire,
      isDraft: article.isDraft,
      version: article.version,
      tags: article.tags.map((tag) => tag.id),
    };
  }

  async saveArticle(
    body: SaveArticleDtoReq,
    user: User,
    draftArticleId?: string,
  ) {
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

    const payload = {
      title,
      author: nickName,
      content,
      status,
      category: {
        connect: {
          id: categoryId,
        },
      },
      viewCount: 0,
      previewUrl,
      isTop,
      isFire,
      isDraft: false,
      pictures: {
        connect: Object.keys(images).map((id) => ({
          id: parseInt(id),
        })),
      },
      tags: {
        connect: tagIds.map((tagId) => ({
          id: tagId,
        })),
      },
    };

    return await this.articleRepository.getArticlePrisma().upsert({
      create: payload,
      update: {
        ...payload,
        pictures: {
          set: payload.pictures.connect,
        },
        tags: {
          set: payload.tags.connect,
        },
      },
      where: {
        id: draftArticleId,
      },
    });
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

    const where: Prisma.ArticleWhereInput = {};
    if (title) {
      where.title = {
        contains: title,
      };
    }
    if (status !== undefined) {
      where.status = status;
    }

    if (categoryId !== undefined) {
      where.categoryId = categoryId;
    }

    if (tagId !== undefined) {
      where.tags = {
        every: {
          id: tagId,
        },
      };
    }

    if (isTop !== undefined) {
      where.isTop = isTop;
    }

    if (isFire !== undefined) {
      where.isFire = isFire;
    }

    if (isDraft !== undefined) {
      where.isDraft = isDraft;
    }

    const { skip, take, orderBy } = generatePageAndOrderQuery(
      currentPage,
      pageSize,
      sortField,
      sortOrder,
    );

    const pageSql = this.articleRepository.getArticlePrisma().findMany({
      where,
      skip,
      take,
      orderBy,
      select: {
        id: true,
        title: true,
        author: true,
        status: true,
        viewCount: true,
        previewUrl: true,
        isTop: true,
        isFire: true,
        isDraft: true,
        version: true,
        updateTime: true,
        category: {
          select: {
            categoryName: true,
          },
        },
        tags: true,
      },
    });
    const countSql = this.articleRepository.getArticlePrisma().count({ where });

    const [list, total] = await Promise.all([pageSql, countSql]);

    return {
      total,
      list: list.map((item) => {
        const { category, tags, updateTime, ...rest } = item;
        return {
          ...rest,
          categoryName: category.categoryName,
          updateTime: updateTime.getTime(),
          tags: tags.map(({ id, tagName, color }) => ({ id, tagName, color })),
        };
      }),
    };
  }

  async deleteArticleById(id: string) {
    const deleteTagsAndPictures =
      this.articleRepository.deleteRelatedTagsAndPictures(id);
    const deleteArticle = this.articleRepository.deleteArticle(id);
    await this.articleRepository.transaction([
      deleteTagsAndPictures,
      deleteArticle,
    ]);
  }

  async updateArticleField<T extends string & keyof Article>(
    articleId: string,
    flagKey: T,
    value: Article[T],
    version: number,
  ) {
    try {
      await this.articleRepository.updateById(
        {
          id: articleId,
          version,
        },
        {
          [flagKey]: value,
        },
      );
    } catch (e) {
      if (e.code === PRISMA_ERROR.NOT_FOUNT) {
        throw new ConflictException(
          ApiJsonResult.error(
            ARTICLE_ERROR.ARTICLE_VERSION_CONFLICT,
            'Article version conflict',
          ),
        );
      }
      throw e;
    }
  }

  async updateArticle(id: string, body: UpdateArticleDtoReq) {
    const {
      title,
      content,
      status,
      categoryId,
      previewUrl,
      isTop,
      isFire,
      tagIds,
      version,
    } = body;

    const images = this.collectImageFromArticle(content);

    try {
      await this.articleRepository.update(
        {
          title,
          content,
          status,
          category: {
            connect: {
              id: categoryId,
            },
          },
          previewUrl,
          isTop,
          isFire,
          pictures: {
            set: Object.keys(images).map((id) => ({
              id: parseInt(id),
            })),
          },
          tags: {
            set: tagIds.map((tagId) => ({
              id: tagId,
            })),
          },
        },
        {
          id,
          version,
        },
      );
    } catch (e) {
      this.logger.error(e);
      if (e.code === PRISMA_ERROR.NOT_FOUNT) {
        throw new ConflictException(
          ApiJsonResult.error(
            ARTICLE_ERROR.ARTICLE_VERSION_CONFLICT,
            'Article version conflict',
          ),
        );
      }
      throw e;
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
