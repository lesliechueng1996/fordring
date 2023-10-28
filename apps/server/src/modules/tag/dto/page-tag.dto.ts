import { PageTagItem, PageTagReq, PageTagRes } from '@fordring/api-type';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationReqDto } from 'src/dto/pagination-req.dto';
import { Tag } from 'src/entities';

export class PageTagReqDto extends PaginationReqDto implements PageTagReq {
  @ApiProperty({ description: '标签名称', required: false })
  tagName: string | null | undefined;
}

export class PageTagResItem implements PageTagItem {
  @ApiProperty({ description: '标签ID' })
  id: number;

  @ApiProperty({ description: '标签名称' })
  tagName: string;

  @ApiProperty({ description: '标签颜色' })
  color: string;

  @ApiProperty({ description: '创建时间' })
  createTime: number;

  @ApiProperty({ description: '版本号' })
  version: number;

  constructor(tag: Tag) {
    this.id = tag.id;
    this.tagName = tag.tagName;
    this.color = tag.color;
    this.createTime = tag.createTime.getTime();
    this.version = tag.version;
  }
}

export class PageTagResDto implements PageTagRes {
  @ApiProperty({ description: '总数' })
  total: number;

  @ApiProperty({ description: '标签列表' })
  list: Array<PageTagResItem>;
}
