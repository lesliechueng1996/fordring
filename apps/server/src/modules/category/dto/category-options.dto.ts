import { ApiProperty } from '@nestjs/swagger';

export class CategoryOptionsResDto {
  @ApiProperty({
    description: '分类名称',
  })
  label: string;

  @ApiProperty({
    description: '分类id',
  })
  value: string;
}
