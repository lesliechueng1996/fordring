import { ApiProperty } from '@nestjs/swagger';
import { SaveArticleDtoReq } from './save-article.dto';
import { IsNumber } from 'class-validator';

export class UpdateArticleDtoReq extends SaveArticleDtoReq {
  @ApiProperty({ description: '文章版本' })
  @IsNumber()
  version: number;
}
