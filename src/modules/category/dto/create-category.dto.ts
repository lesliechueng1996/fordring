import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCategoryReqDto {
  @IsNotEmpty()
  @MaxLength(32)
  @ApiProperty({
    description: '分类名称',
    example: 'Java',
    maxLength: 32,
  })
  categoryName: string;
}
