import {
  PageArticleItem,
  PageArticleReq,
  PageArticleRes,
} from '@fordring/api-type';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, ValidateIf } from 'class-validator';
import { PaginationReqDto } from 'src/dto/pagination-req.dto';
import { ArticleStatus } from 'src/entities';
import { BaseEntity } from 'src/entities';
import { Tag } from 'src/entities';

export class PageArticleDtoReq
  extends PaginationReqDto
  implements PageArticleReq
{
  @ApiProperty({ description: '文章标题', required: false })
  title: string | null | undefined;

  @ApiProperty({
    description: `文章状态, ${ArticleStatus.HIDDEN} - 隐藏, ${ArticleStatus.SHOW} - 显示`,
    enum: [ArticleStatus.HIDDEN, ArticleStatus.SHOW],
    required: false,
  })
  @IsEnum([ArticleStatus.HIDDEN, ArticleStatus.SHOW])
  @ValidateIf((o) => !(o !== null && o !== undefined))
  status: number | undefined;

  @ApiProperty({ description: '分类ID', required: false })
  @IsNumber()
  @ValidateIf((o) => !o)
  categoryId: number | undefined;

  @ApiProperty({ description: '标签ID', required: false })
  @IsNumber()
  @ValidateIf((o) => !o)
  tagId: number | undefined;

  @ApiProperty({ description: '是否置顶', required: false })
  @IsBoolean()
  @ValidateIf((o) => !o)
  isTop: boolean | undefined;

  @ApiProperty({ description: '是否精华', required: false })
  @IsBoolean()
  @ValidateIf((o) => !o)
  isFire: boolean | undefined;

  @ApiProperty({ description: '是否草稿', required: false })
  @IsBoolean()
  @ValidateIf((o) => !o)
  isDraft: boolean | undefined;
}

export class PageArticleResItem implements PageArticleItem {
  @ApiProperty({ description: '文章id' })
  id: string;

  @ApiProperty({ description: '文章标题' })
  title: string;

  @ApiProperty({ description: '文章作者' })
  author: string;

  @ApiProperty({ description: '文章状态' })
  status: number;

  @ApiProperty({ description: '文章分类id' })
  categoryName: string;

  @ApiProperty({ description: '浏览次数' })
  viewCount: number;

  @ApiProperty({ description: '预览图' })
  previewUrl: string | null;

  @ApiProperty({ description: '是否置顶' })
  isTop: boolean;

  @ApiProperty({ description: '是否精华' })
  isFire: boolean;

  @ApiProperty({ description: '是否草稿' })
  isDraft: boolean;

  @ApiProperty({ description: '文章版本' })
  version: number;

  @ApiProperty({ description: '更新时间' })
  updateTime: number;

  @ApiProperty({ description: '标签列表' })
  tags: Omit<Tag, keyof BaseEntity>[];
}

export class PageArticleDtoRes implements PageArticleRes {
  @ApiProperty({ description: '总数' })
  total: number;
  @ApiProperty({ description: '文章列表' })
  list: Array<PageArticleResItem>;
}
