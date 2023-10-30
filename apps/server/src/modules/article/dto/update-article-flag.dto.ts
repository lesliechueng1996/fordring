import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { ArticleStatus } from 'src/constants/fordring.const';

export class UpdateArticleTopFlagDtoReq {
  @ApiProperty({ description: '是否置顶' })
  @IsBoolean()
  isTop: boolean;

  @ApiProperty({ description: '文章版本' })
  @IsNumber()
  version: number;
}

export class UpdateArticleFireFlagDtoReq {
  @ApiProperty({ description: '是否精华' })
  @IsBoolean()
  isFire: boolean;

  @ApiProperty({ description: '文章版本' })
  @IsNumber()
  version: number;
}

export class UpdateArticleStatusDtoReq {
  @ApiProperty({ description: '文章状态' })
  @IsEnum([ArticleStatus.HIDDEN, ArticleStatus.SHOW])
  status: number;

  @ApiProperty({ description: '文章版本' })
  @IsNumber()
  version: number;
}
