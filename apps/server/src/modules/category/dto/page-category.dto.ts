import {
  PageCategoryRes,
  PageCategoryItem,
  PageCategoryReq,
} from '@fordring/api-type';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationReqDto } from 'src/dto/pagination-req.dto';

export class PageCategoryReqDto
  extends PaginationReqDto
  implements PageCategoryReq
{
  @ApiProperty({ description: '分类名称', required: false })
  categoryName: string | undefined | null;
}

export class PageCategoryResItem implements PageCategoryItem {
  @ApiProperty({ description: '分类id' })
  id: number;
  @ApiProperty({ description: '分类名称' })
  categoryName: string;
  @ApiProperty({ description: '创建时间' })
  createTime: number;
  @ApiProperty({ description: '版本号' })
  version: number;
}

export class PageCategoryResDto implements PageCategoryRes {
  @ApiProperty({ description: '总数' })
  total: number;
  @ApiProperty({ description: '分类列表' })
  list: Array<PageCategoryResItem>;
}
