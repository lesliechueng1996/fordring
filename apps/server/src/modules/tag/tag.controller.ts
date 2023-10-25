import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { AuthGuard } from 'src/guards/AuthGuard';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AUTHENTICATION } from 'src/constants/fordring.const';
import {
  ApiJsonResult,
  ApiJsonResultResponse,
} from 'src/dto/api-json-result.dto';
import { CreateTagDtoReq } from './dto/create-tag.dto';
import { PageTagReqDto, PageTagResDto } from './dto/page-tag.dto';
import { GetTagResDto } from './dto/get-tag.dto';
import { UpdateTagReqDto } from './dto/update-tag.dto';
import { TagOptionsDtoRes } from './dto/tag-options.dto';

@Controller('tag')
@UseGuards(AuthGuard)
@ApiTags('Tag')
@ApiHeader({ name: AUTHENTICATION, description: 'token' })
@ApiExtraModels(ApiJsonResult)
@ApiBadRequestResponse({ description: '参数错误' })
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({ summary: '创建标签' })
  @ApiCreatedResponse({ description: '创建成功' })
  @ApiConflictResponse({ description: '标签已存在' })
  async createTag(@Body() body: CreateTagDtoReq) {
    const { tagName, color } = body;
    await this.tagService.createTag(tagName, color);
  }

  @Get('page')
  @ApiOperation({ summary: '获取标签列表' })
  @ApiOkResponse({ description: '获取标签列表成功' })
  @ApiJsonResultResponse(PageTagResDto)
  async pageTag(@Query() query: PageTagReqDto) {
    return await this.tagService.searchTagByPage(query);
  }

  @Get('options')
  @ApiOperation({ summary: '获取标签选项' })
  @ApiOkResponse({ description: '获取标签选项成功' })
  @ApiJsonResultResponse(TagOptionsDtoRes)
  async categoryOptions() {
    return await this.tagService.tagToOptions();
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除标签' })
  @ApiOkResponse({ description: '删除成功' })
  async removeTag(@Param('id') id: number) {
    await this.tagService.removeTag(id);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取标签详情' })
  @ApiOkResponse({ description: '获取标签详情成功' })
  @ApiJsonResultResponse(GetTagResDto)
  async getTag(@Param('id') id: number) {
    const tag = await this.tagService.getTag(id);
    return new GetTagResDto(tag);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新标签' })
  @ApiOkResponse({ description: '更新标签成功' })
  @ApiConflictResponse({ description: '标签已存在' })
  async updateTag(@Param('id') id: number, @Body() body: UpdateTagReqDto) {
    const { tagName, color, version } = body;
    return await this.tagService.updateTag(id, tagName, color, version);
  }
}
