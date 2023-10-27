import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsNotEmpty, MaxLength } from 'class-validator';
import { CreateTagReq } from '@fordring/api-type';

export class CreateTagDtoReq implements CreateTagReq {
  @ApiProperty({
    description: '标签名',
    example: '前端',
    maxLength: 32,
  })
  @IsNotEmpty()
  @MaxLength(32)
  tagName: string;

  @ApiProperty({
    description: '颜色',
    example: 'FF0000',
  })
  @IsNotEmpty()
  @IsHexColor()
  @MaxLength(16)
  color: string;
}
