import { ApiProperty } from '@nestjs/swagger';

export class AlbumOptionsResDto {
  @ApiProperty({
    description: '图册名称',
  })
  label: string;

  @ApiProperty({
    description: '图册id',
  })
  value: string;
}
