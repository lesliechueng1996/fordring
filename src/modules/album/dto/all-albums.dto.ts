import { ApiProperty } from '@nestjs/swagger';
import { Album } from 'src/entities/album.entity';

export class AllAlbumsResItem {
  @ApiProperty({ description: '图册id' })
  id: number;

  @ApiProperty({ description: '图册名称' })
  displayName: string;

  @ApiProperty({ description: '图册文件夹名称' })
  folderName: string;

  @ApiProperty({ description: '图册描述' })
  description: string;

  @ApiProperty({ description: '图册预览图' })
  previewUrl: string;

  constructor(album: Album) {
    this.id = album.id;
    this.displayName = album.displayName;
    this.folderName = album.folderName;
    this.description = album.description;
    this.previewUrl = album.previewUrl;
  }
}

export class AllAlbumsResDto {
  @ApiProperty({ type: [AllAlbumsResItem], description: '所有图册' })
  list: AllAlbumsResItem[];
}
