import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class SaveDraftDtoReq {
  @ApiProperty({ description: '文章标题' })
  @IsNotEmpty()
  @MaxLength(128)
  title: string;

  @ApiProperty({ description: '文章内容' })
  @IsNotEmpty()
  content: string;
}

export class SaveDraftDtoRes {
  @ApiProperty({ description: '文章ID' })
  id: string;
}
