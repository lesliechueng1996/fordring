import { ApiProperty } from '@nestjs/swagger';

export class GetArticleResDto {
  @ApiProperty({ description: '文章id' })
  id: string;

  @ApiProperty({ description: '文章标题' })
  title: string;

  @ApiProperty({ description: '文章作者' })
  author: string;

  @ApiProperty({ description: '文章内容' })
  content: string;

  @ApiProperty({ description: '文章状态' })
  status: number;

  @ApiProperty({ description: '文章分类id' })
  categoryId: number | null;

  @ApiProperty({ description: '文章预览URL' })
  previewUrl: string | null;

  @ApiProperty({ description: '是否置顶' })
  isTop: boolean;

  @ApiProperty({ description: '是否精华' })
  isFire: boolean;

  @ApiProperty({ description: '是否草稿' })
  isDraft: boolean;

  @ApiProperty({ description: '文章版本' })
  version: number;

  @ApiProperty({ description: '标签id数组' })
  tags: number[];
}
