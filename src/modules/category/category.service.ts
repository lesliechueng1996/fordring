import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CATEGORY_ERROR } from 'src/constants/error.const';
import { ApiJsonResult } from 'src/dto/api-json-result.dto';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';

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
}
