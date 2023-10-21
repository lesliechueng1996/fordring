import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CATEGORY_ERROR } from 'src/constants/error.const';
import { ApiJsonResult } from 'src/dto/api-json-result.dto';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';
import { PageCategoryReqDto } from './dto/page-category.dto';
import { withPageAndOrderQuery } from 'src/utils/query-builder.util';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  private readonly logger: Logger = new Logger(CategoryService.name);

  async isCategoryNameExist(categoryName: string) {
    const count = await this.countByCategoryName(categoryName);
    if (count > 0) {
      throw new ConflictException(
        ApiJsonResult.error(
          CATEGORY_ERROR.CATEGORY_ALREADY_EXIST,
          'Category already exist',
        ),
      );
    }
  }

  async countByCategoryName(categoryName: string) {
    return await this.categoryRepository.countBy({ categoryName });
  }

  async createCategory(categoryName: string) {
    await this.isCategoryNameExist(categoryName);

    try {
      await this.categoryRepository.insert({
        categoryName,
      });
    } catch (error) {
      throw ApiJsonResult.error(
        CATEGORY_ERROR.CREATE_CATEGORY_FAILED,
        'Create category failed',
      );
    }
  }

  async searchCategoriesByPage(query: PageCategoryReqDto) {
    const { categoryName, currentPage, pageSize, sortField, sortOrder } = query;

    let queryBuilder = this.categoryRepository.createQueryBuilder();
    if (categoryName) {
      queryBuilder = queryBuilder.where('category_name like :categoryName', {
        categoryName: `%${categoryName}%`,
      });
    }

    const countQueryBuilder = queryBuilder.clone();

    queryBuilder = withPageAndOrderQuery(
      queryBuilder,
      currentPage,
      pageSize,
      sortField,
      sortOrder,
    );

    const [categoryList, total] = await Promise.all([
      queryBuilder.getMany(),
      countQueryBuilder.getCount(),
    ]);

    const list = categoryList.map((category) => ({
      id: category.id,
      categoryName: category.categoryName,
      createTime: category.createTime.getTime(),
      version: category.version,
    }));

    return {
      list,
      total,
    };
  }

  async deleteCategory(id: number) {
    await this.categoryRepository.delete(id);
  }

  getCategoryById(id: number) {
    return this.categoryRepository.findOneBy({
      id,
    });
  }

  async updateCategory(id: number, categoryName: string, version: number) {
    await this.isCategoryNameExist(categoryName);

    let result;
    try {
      result = await this.categoryRepository.update(
        {
          id,
          version,
        },
        {
          categoryName,
        },
      );
    } catch (e) {
      this.logger.error(`Update category failed, id: ${id}`);

      throw ApiJsonResult.error(
        CATEGORY_ERROR.UPDATE_CATEGORY_FAILED,
        'Update category failed',
      );
    }

    if (result.affected === 0) {
      this.logger.error(`Category version conflict, id: ${id}`);

      throw new ConflictException(
        ApiJsonResult.error(
          CATEGORY_ERROR.CATEGORY_VERSION_CONFLICT,
          'Category version conflict',
        ),
      );
    }
  }
}
