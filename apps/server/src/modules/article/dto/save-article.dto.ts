import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { ArticleStatus } from 'src/entities';

export class SaveArticleDtoReq {
  @ApiProperty({ description: '文章标题' })
  @IsNotEmpty()
  @MaxLength(32)
  title: string;

  @ApiProperty({ description: '文章内容' })
  content: string;

  @ApiProperty({
    description: `文章状态, ${ArticleStatus.HIDDEN} - 隐藏, ${ArticleStatus.SHOW} - 显示`,
    enum: [ArticleStatus.HIDDEN, ArticleStatus.SHOW],
  })
  @IsEnum([ArticleStatus.HIDDEN, ArticleStatus.SHOW])
  status: ArticleStatus;

  @ApiProperty({ description: '文章分类ID', required: false })
  @IsNumber()
  @ValidateIf((o) => !o)
  categoryId: number | null;

  @ApiProperty({ description: '预览图片URL', required: false })
  @ValidateIf((o) => !o)
  @MaxLength(256)
  previewUrl: string | null;

  @ApiProperty({ description: '是否置顶' })
  @IsBoolean()
  isTop: boolean;

  @ApiProperty({ description: '是否精华' })
  @IsBoolean()
  isFire: boolean;

  @ApiProperty({ description: '标签ID列表' })
  tagIds: number[];
}

export class SaveArticleDtoRes {
  @ApiProperty({ description: '文章ID' })
  id: string;
}
