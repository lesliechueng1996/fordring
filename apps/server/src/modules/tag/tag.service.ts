import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TAG_ERROR } from 'src/constants/error.const';
import { ApiJsonResult } from 'src/dto/api-json-result.dto';
import { Tag } from 'src/entities/tag.entity';
import { Not, Repository, UpdateResult } from 'typeorm';
import { PageTagReqDto, PageTagResItem } from './dto/page-tag.dto';
import { withPageAndOrderQuery } from 'src/utils/query-builder.util';
import { TagOptionsDtoRes } from './dto/tag-options.dto';

@Injectable()
export class TagService {
  private readonly logger: Logger = new Logger(TagService.name);

  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}

  async validateTagNameExists(tagName: string, exceptedId?: number) {
    const options = { where: { tagName } };
    if (exceptedId) {
      options.where['id'] = Not(exceptedId);
    }

    const isExist = await this.tagRepository.exist(options);
    if (isExist) {
      throw new ConflictException(
        ApiJsonResult.error(TAG_ERROR.TAG_ALREADY_EXIST, 'tag already exist')
      );
    }
  }

  async createTag(tagName: string, color: string) {
    await this.validateTagNameExists(tagName);
    try {
      await this.tagRepository.insert({ tagName, color: color.toUpperCase() });
    } catch (e) {
      this.logger.error(e);
      throw ApiJsonResult.error(
        TAG_ERROR.CREATE_TAG_FAILED,
        'create tag failed'
      );
    }
  }

  async searchTagByPage(query: PageTagReqDto) {
    const { tagName, currentPage, pageSize, sortField, sortOrder } = query;

    let queryBuilder = this.tagRepository.createQueryBuilder();
    if (tagName) {
      queryBuilder = queryBuilder.where('tag_name like :tagName', {
        tagName: `%${tagName}%`,
      });
    }

    const countQueryBuilder = queryBuilder.clone();

    queryBuilder = withPageAndOrderQuery(
      queryBuilder,
      currentPage,
      pageSize,
      sortField,
      sortOrder
    );

    const [tagList, total] = await Promise.all([
      queryBuilder.getMany(),
      countQueryBuilder.getCount(),
    ]);

    const list: PageTagResItem[] = tagList.map(
      (tag) => new PageTagResItem(tag)
    );

    return { list, total };
  }

  async removeTag(id: number) {
    // TODO check tag is used by article
    return this.tagRepository.delete(id);
  }

  async getTag(id: number) {
    return this.tagRepository.findOneBy({ id });
  }

  async updateTag(id: number, tagName: string, color: string, version: number) {
    await this.validateTagNameExists(tagName, id);

    let result: UpdateResult;

    try {
      result = await this.tagRepository.update(
        {
          id,
          version,
        },
        {
          tagName,
          color: color.toUpperCase(),
        }
      );
    } catch (e) {
      this.logger.error(e);
      throw ApiJsonResult.error(
        TAG_ERROR.UPDATE_TAG_FAILED,
        'Update tag failed'
      );
    }

    if (result.affected === 0) {
      this.logger.error(`tag ${id} not found or version ${version} not match`);
      throw new ConflictException(
        ApiJsonResult.error(
          TAG_ERROR.TAG_VERSION_CONFLICT,
          'Tag not found or version not match'
        )
      );
    }
  }

  async tagToOptions(): Promise<TagOptionsDtoRes[]> {
    const tagList = await this.tagRepository.find();
    return tagList.map((tag) => ({
      label: tag.tagName,
      value: tag.id.toString(),
    }));
  }
}
