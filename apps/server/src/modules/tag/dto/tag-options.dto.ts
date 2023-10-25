import { ApiProperty } from '@nestjs/swagger';

export class TagOptionsDtoRes {
  @ApiProperty({
    description: '标签名称',
  })
  label: string;

  @ApiProperty({
    description: '标签id',
  })
  value: string;
}
