import { GetAlbumRes } from '@fordring/api-type';
import { ApiProperty } from '@nestjs/swagger';
import { Album } from 'src/entities/album.entity';

export class GetAlbumResDto implements GetAlbumRes {
  @ApiProperty({ description: '图册id' })
  id: number;

  @ApiProperty({ description: '图册名称' })
  displayName: string;

  @ApiProperty({ description: '图册文件夹名称' })
  folderName: string;

  @ApiProperty({ description: '图册描述' })
  description: string | null;

  @ApiProperty({ description: '图册预览图' })
  previewUrl: string | null;

  @ApiProperty({ description: '图册版本' })
  version: number;

  @ApiProperty({ description: '图册图片数量' })
  pictureCount: number;

  constructor(album: Album, pictureCount: number) {
    this.id = album.id;
    this.displayName = album.displayName;
    this.folderName = album.folderName;
    this.description = album.description;
    this.previewUrl = album.previewUrl;
    this.version = album.version;
    this.pictureCount = pictureCount;
  }
}
