import { UpdateTagReq } from '@fordring/api-type';
import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class UpdateTagReqDto implements UpdateTagReq {
  @ApiProperty({ description: '标签名称', maxLength: 32 })
  @IsNotEmpty()
  @MaxLength(32)
  tagName: string;

  @ApiProperty({ description: '标签颜色' })
  @IsNotEmpty()
  @IsHexColor()
  @MaxLength(16)
  color: string;

  @ApiProperty({ description: '版本号' })
  @IsNumber()
  version: number;
}
