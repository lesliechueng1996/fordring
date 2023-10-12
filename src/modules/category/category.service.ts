import { ConflictException, Injectable } from '@nestjs/common';
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

  async countByCategoryName(categoryName: string) {
    return await this.categoryRepository.countBy({ categoryName });
  }

  async createCategory(categoryName: string) {
    const count = await this.countByCategoryName(categoryName);
    if (count > 0) {
      throw new ConflictException(
        ApiJsonResult.error(
          CATEGORY_ERROR.CATEGORY_ALREADY_EXIST,
          'Category already exist',
        ),
      );
    }

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

    const categoryList = await queryBuilder.getMany();
    const total = await countQueryBuilder.getCount();

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
}
