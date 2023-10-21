import { ApiProperty } from '@nestjs/swagger';
import { GetAlbumsResDto } from './get-album.dto';

export class AllAlbumsResDto {
  @ApiProperty({ type: [GetAlbumsResDto], description: '所有图册' })
  list: GetAlbumsResDto[];
}
