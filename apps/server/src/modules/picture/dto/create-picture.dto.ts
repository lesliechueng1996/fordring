import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, MaxLength, ValidateIf } from 'class-validator';

export class CreatePictureReqDto {
  @ApiProperty({
    description: '相册ID',
  })
  @IsNumber()
  albumId: number;

  @ApiProperty({
    description: '图片名称',
  })
  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  @ApiProperty({
    description: '图片描述',
    required: false,
  })
  @MaxLength(256)
  @ValidateIf((o) => !o)
  description: string;

  @ApiProperty({
    description: '图片存储Key',
  })
  @MaxLength(128)
  @IsNotEmpty()
  storageKey: string;
}

export class CreatePictureResDto {
  @ApiProperty({
    description: '图片ID',
  })
  id: number;

  @ApiProperty({
    description: '图片URL',
  })
  url: string;
}
