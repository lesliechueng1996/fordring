import { ApiProperty } from '@nestjs/swagger';
import { GetAlbumResDto } from './get-album.dto';
import { AllAlbumsRes } from '@fordring/api-type';

export class AllAlbumsResDto implements AllAlbumsRes {
  @ApiProperty({ type: [GetAlbumResDto], description: '所有图册' })
  list: GetAlbumResDto[];
}
