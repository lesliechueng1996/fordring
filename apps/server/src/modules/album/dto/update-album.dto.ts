import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export class UpdateAlbumDtoReq {
  @ApiProperty({
    description: '图册名称',
    example: '图册名称',
    maxLength: 16,
  })
  @IsNotEmpty()
  @MaxLength(16)
  displayName: string;

  @ApiProperty({
    description: '图册文件夹名称',
    example: 'images',
    maxLength: 32,
  })
  @IsNotEmpty()
  @MaxLength(32)
  folderName: string;

  @ApiProperty({
    description: '图册描述',
    example: '图册描述',
    maxLength: 256,
  })
  @MaxLength(256)
  @ValidateIf((o) => !o)
  description: string;

  @ApiProperty({
    description: '图册预览图',
    example: 'https://xxx.com/xxx.png',
    maxLength: 256,
  })
  @MaxLength(256)
  @ValidateIf((o) => !o)
  previewUrl: string;

  @ApiProperty({
    description: '图册版本',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  version: number;
}
