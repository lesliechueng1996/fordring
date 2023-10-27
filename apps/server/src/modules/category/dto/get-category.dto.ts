import { GetCategoryRes } from '@fordring/api-type';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/entities/category.entity';

export class GetCategoryResDto implements GetCategoryRes {
  @ApiProperty({
    description: '分类id',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '分类名称',
    example: '分类1',
  })
  categoryName: string;

  @ApiProperty({
    description: '版本号',
    example: 1,
  })
  version: number;

  constructor(category: Category) {
    this.id = category.id;
    this.categoryName = category.categoryName;
    this.version = category.version;
  }
}
