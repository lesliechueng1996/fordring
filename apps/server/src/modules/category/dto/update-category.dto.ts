import { UpdateCategoryReq } from '@fordring/api-type';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, MaxLength, Min } from 'class-validator';

export class UpdateCategoryReqDto implements UpdateCategoryReq {
  @ApiProperty({
    description: '分类名称',
    example: '分类1',
  })
  @IsNotEmpty({ message: '分类名称不能为空' })
  @MaxLength(32)
  categoryName: string;

  @ApiProperty({
    description: '版本号',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  version: number;
}
