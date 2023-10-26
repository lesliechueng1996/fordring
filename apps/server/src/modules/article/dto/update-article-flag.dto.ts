import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

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
