import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { TAG_ERROR } from 'src/constants/error.const';
import { ApiJsonResult } from 'src/dto/api-json-result.dto';
import { PageTagReqDto, PageTagResItem } from './dto/page-tag.dto';
import { generatePageAndOrderQuery } from 'src/utils/query-builder.util';
import { TagOptionsDtoRes } from './dto/tag-options.dto';
import { TagRepository } from 'src/repositories/tag.repository';
import { Prisma } from '@prisma/client';
import { PRISMA_ERROR } from 'src/constants/fordring.const';

@Injectable()
export class TagService {
  private readonly logger: Logger = new Logger(TagService.name);

  constructor(private tagRepository: TagRepository) {}

  async validateTagNameExists(tagName: string, exceptedId?: number) {
    const options: { where: Prisma.TagWhereInput } = { where: { tagName } };
    if (exceptedId) {
      options.where.id = {
        not: exceptedId,
      };
    }

    const isExist = await this.tagRepository.exist(options);
    if (isExist) {
      throw new ConflictException(
        ApiJsonResult.error(TAG_ERROR.TAG_ALREADY_EXIST, 'tag already exist'),
      );
    }
  }

  async createTag(tagName: string, color: string) {
    await this.validateTagNameExists(tagName);
    try {
      await this.tagRepository.save({ tagName, color: color.toUpperCase() });
    } catch (e) {
      this.logger.error(e);
      throw ApiJsonResult.error(
        TAG_ERROR.CREATE_TAG_FAILED,
        'create tag failed',
      );
    }
  }

  async searchTagByPage(query: PageTagReqDto) {
    const { tagName, currentPage, pageSize, sortField, sortOrder } = query;

    const where: Prisma.TagWhereInput = {};

    if (tagName) {
      where.tagName = {
        contains: tagName,
      };
    }

    const { skip, take, orderBy } = generatePageAndOrderQuery(
      currentPage,
      pageSize,
      sortField,
      sortOrder,
    );

    const [tagList, total] = await Promise.all([
      this.tagRepository.searchByPage(where, take, skip, orderBy),
      this.tagRepository.count(where),
    ]);

    const list: PageTagResItem[] = tagList.map(
      (tag) => new PageTagResItem(tag),
    );

    return { list, total };
  }

  async removeTag(id: number) {
    // TODO check tag is used by article
    return this.tagRepository.deleteById(id);
  }

  async getTag(id: number) {
    return this.tagRepository.findById(id);
  }

  async updateTag(id: number, tagName: string, color: string, version: number) {
    await this.validateTagNameExists(tagName, id);

    try {
      await this.tagRepository.updateById(
        {
          id,
          version,
        },
        {
          tagName,
          color: color.toUpperCase(),
        },
      );
    } catch (e) {
      this.logger.error(e);

      if (e.code === PRISMA_ERROR.NOT_FOUNT) {
        this.logger.error(
          `tag ${id} not found or version ${version} not match`,
        );
        throw new ConflictException(
          ApiJsonResult.error(
            TAG_ERROR.TAG_VERSION_CONFLICT,
            'Tag not found or version not match',
          ),
        );
      }

      throw ApiJsonResult.error(
        TAG_ERROR.UPDATE_TAG_FAILED,
        'Update tag failed',
      );
    }
  }

  async tagToOptions(): Promise<TagOptionsDtoRes[]> {
    const tagList = await this.tagRepository.findAll();
    return tagList.map((tag) => ({
      label: tag.tagName,
      value: tag.id.toString(),
    }));
  }
}
