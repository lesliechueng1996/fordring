import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CATEGORY_ERROR } from 'src/constants/error.const';
import { ApiJsonResult } from 'src/dto/api-json-result.dto';
import { PageCategoryReqDto } from './dto/page-category.dto';
import { CategoryOptionsResDto } from './dto/category-options.dto';
import { CategoryRepository } from 'src/repositories/category.repository';
import { Prisma } from '@prisma/client';
import { generatePageAndOrderQuery } from 'src/utils/query-builder.util';
import { PRISMA_ERROR } from 'src/constants/fordring.const';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

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
    return await this.categoryRepository.countByCategoryName(categoryName);
  }

  async createCategory(categoryName: string) {
    await this.isCategoryNameExist(categoryName);

    try {
      await this.categoryRepository.save({
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

    const where: Prisma.CategoryWhereInput = {};

    if (categoryName) {
      where.categoryName = {
        contains: categoryName,
      };
    }

    const { skip, take, orderBy } = generatePageAndOrderQuery(
      currentPage,
      pageSize,
      sortField,
      sortOrder,
    );

    const [categoryList, total] = await Promise.all([
      this.categoryRepository.searchByPage(where, take, skip, orderBy),
      this.categoryRepository.count(where),
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
    await this.categoryRepository.deleteById(id);
  }

  getCategoryById(id: number) {
    return this.categoryRepository.findById(id);
  }

  async updateCategory(id: number, categoryName: string, version: number) {
    await this.isCategoryNameExist(categoryName);

    try {
      await this.categoryRepository.updateById(
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

      if (e.code === PRISMA_ERROR.NOT_FOUNT) {
        this.logger.error(`Category version conflict, id: ${id}`);

        throw new ConflictException(
          ApiJsonResult.error(
            CATEGORY_ERROR.CATEGORY_VERSION_CONFLICT,
            'Category version conflict',
          ),
        );
      }

      throw ApiJsonResult.error(
        CATEGORY_ERROR.UPDATE_CATEGORY_FAILED,
        'Update category failed',
      );
    }
  }

  async categoryToOptions(): Promise<CategoryOptionsResDto[]> {
    const categoryList = await this.categoryRepository.findAll();

    return categoryList.map((category) => ({
      label: category.categoryName,
      value: category.id.toString(),
    }));
  }
}
