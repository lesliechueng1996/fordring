import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/guards/AuthGuard';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiJsonResult,
  ApiJsonResultResponse,
} from 'src/dto/api-json-result.dto';
import { CreateCategoryReqDto } from './dto/create-category.dto';
import {
  PageCategoryReqDto,
  PageCategoryResDto,
} from './dto/page-category.dto';

@Controller('category')
@UseGuards(AuthGuard)
@ApiTags('Category')
@ApiExtraModels(ApiJsonResult)
@ApiBadRequestResponse({ description: '参数错误' })
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: '创建分类' })
  @ApiCreatedResponse({
    description: '创建分类成功',
  })
  @ApiConflictResponse({
    description: '分类已存在',
  })
  async createCategory(@Body() body: CreateCategoryReqDto) {
    await this.categoryService.createCategory(body.categoryName);
  }

  @Get()
  @ApiOperation({ summary: '获取分类列表' })
  @ApiOkResponse({
    description: '获取分类列表成功',
  })
  @ApiJsonResultResponse(PageCategoryResDto)
  async pageCategory(
    @Query() query: PageCategoryReqDto,
  ): Promise<PageCategoryResDto> {
    return await this.categoryService.searchCategoriesByPage(query);
  }
}
