import { ApiProperty } from '@nestjs/swagger';

export class AllPicturesDtoItem {
  @ApiProperty({ description: '图片id' })
  id: number;

  @ApiProperty({ description: '图片名称' })
  name: string;

  @ApiProperty({ description: '图片url' })
  url: string;

  @ApiProperty({ description: '图片描述' })
  description: string;

  @ApiProperty({ description: '图片创建时间' })
  createTime: number;

  @ApiProperty({ description: '图片版本' })
  version: number;
}

export class AllPicturesResDto {
  @ApiProperty({ description: '图片列表', type: [AllPicturesDtoItem] })
  pictures: Array<AllPicturesDtoItem>;
}
