import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, Max, Min, ValidateIf } from 'class-validator';

export class PaginationReqDto {
  @ApiProperty({
    description: '当前页',
    required: true,
    default: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  currentPage: number;

  @ApiProperty({
    description: '每页条数',
    required: true,
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize: number;

  @ApiProperty({
    description: '排序字段',
    required: false,
  })
  sortField: string | undefined | null;

  @ApiProperty({
    description: '排序方式',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  @IsEnum(['ASC', 'DESC'])
  @ValidateIf((o) => !o)
  sortOrder: 'ASC' | 'DESC' | '' | undefined | null;
}
