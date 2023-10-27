import { DropdownItem } from '@fordring/api-type';
import { ApiProperty } from '@nestjs/swagger';

export class AlbumOptionsResDto implements DropdownItem {
  @ApiProperty({
    description: '图册名称',
  })
  label: string;

  @ApiProperty({
    description: '图册id',
  })
  value: string;
}
