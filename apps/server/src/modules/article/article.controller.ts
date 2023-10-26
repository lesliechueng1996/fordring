import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/AuthGuard';
import { AUTHENTICATION, USER_ID_KEY } from 'src/constants/fordring.const';
import {
  ApiJsonResult,
  ApiJsonResultResponse,
} from 'src/dto/api-json-result.dto';
import { SaveDraftDtoReq, SaveDraftDtoRes } from './dto/save-draft.dto';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { UpdateDraftDtoReq } from './dto/update-draft.dto';
import { ARTICLE_ERROR } from 'src/constants/error.const';
import { SaveArticleDtoReq, SaveArticleDtoRes } from './dto/save-article.dto';
import { PageArticleDtoReq, PageArticleDtoRes } from './dto/page-article.dto';
import {
  UpdateArticleFireFlagDtoReq,
  UpdateArticleStatusDtoReq,
  UpdateArticleTopFlagDtoReq,
} from './dto/update-article-flag.dto';
import { GetArticleResDto } from './dto/get-article.dto';
import { UpdateArticleDtoReq } from './dto/update-article.dto';

@Controller('article')
@ApiTags('Article')
@UseGuards(AuthGuard)
@ApiHeader({ name: AUTHENTICATION, description: 'token' })
@ApiExtraModels(ApiJsonResult)
@ApiBadRequestResponse({ description: '参数错误' })
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly userService: UserService
  ) {}

  @Post('/draft')
  @ApiOperation({ summary: '保存草稿' })
  @ApiCreatedResponse({ description: '保存成功' })
  @ApiJsonResultResponse(SaveDraftDtoRes)
  async saveDraft(
    @Body() body: SaveDraftDtoReq,
    @Req() req: Request
  ): Promise<SaveDraftDtoRes> {
    const userId: string = req[USER_ID_KEY];
    const { title, content } = body;
    const user = await this.userService.getUserById(userId);
    const article = await this.articleService.saveDraftArticle(
      title,
      content,
      user
    );
    return {
      id: article.id,
    };
  }

  @Patch('/draft/:id')
  @ApiOperation({ summary: '更新草稿' })
  @ApiOkResponse({ description: '更新成功' })
  @ApiNotFoundResponse({ description: '文章不存在' })
  async updateDraft(@Param('id') id: string, @Body() body: UpdateDraftDtoReq) {
    const { title, content } = body;
    const article = await this.articleService.getArticleById(id);
    if (!article) {
      throw new NotFoundException(
        ApiJsonResult.error(
          ARTICLE_ERROR.ARTICLE_NOT_FOUND,
          'Article not found'
        )
      );
    }

    await this.articleService.updateDraftArticle(id, title, content);
  }

  @Post()
  @ApiOperation({ summary: '保存文章' })
  @ApiCreatedResponse({ description: '保存成功' })
  @ApiJsonResultResponse(SaveArticleDtoRes)
  async save(@Body() body: SaveArticleDtoReq, @Req() req: Request) {
    const userId: string = req[USER_ID_KEY];
    const user = await this.userService.getUserById(userId);
    const article = await this.articleService.saveArticle(body, user);
    return {
      id: article.id,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: '草稿保存为文章' })
  @ApiOkResponse({ description: '更新成功' })
  @ApiNotFoundResponse({ description: '草稿不存在' })
  async draftToArticle(
    @Param('id') id: string,
    @Body() body: SaveArticleDtoReq,
    @Req() req: Request
  ) {
    const userId: string = req[USER_ID_KEY];
    const user = await this.userService.getUserById(userId);
    const article = await this.articleService.saveArticle(body, user, id);
    return {
      id: article.id,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新文章' })
  @ApiOkResponse({ description: '更新成功' })
  @ApiNotFoundResponse({ description: '文章不存在' })
  async updateArticle(
    @Param('id') id: string,
    @Body() body: UpdateArticleDtoReq
  ) {
    await this.articleService.updateArticle(id, body);
  }

  @Get('page')
  @ApiOperation({ summary: '获取文章列表' })
  @ApiOkResponse({ description: '获取文章列表成功' })
  @ApiJsonResultResponse(PageArticleDtoRes)
  async page(@Query() query: PageArticleDtoReq): Promise<PageArticleDtoRes> {
    return await this.articleService.getArticlesByPage(query);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除文章' })
  @ApiOkResponse({ description: '删除成功' })
  async deleteArticle(@Param('id') id: string) {
    await this.articleService.deleteArticleById(id);
  }

  @Patch(':id/top')
  @ApiOperation({ summary: '更新文章置顶状态' })
  @ApiOkResponse({ description: '更新成功' })
  @ApiConflictResponse({ description: '更新失败，文章版本不一致' })
  async updateArticleTop(
    @Param('id') id: string,
    @Body() body: UpdateArticleTopFlagDtoReq
  ) {
    const { isTop, version } = body;
    await this.articleService.updateArticleField(id, 'isTop', isTop, version);
  }

  @Patch(':id/fire')
  @ApiOperation({ summary: '更新文章精华状态' })
  @ApiOkResponse({ description: '更新成功' })
  @ApiConflictResponse({ description: '更新失败，文章版本不一致' })
  async updateArticleFire(
    @Param('id') id: string,
    @Body() body: UpdateArticleFireFlagDtoReq
  ) {
    const { isFire, version } = body;
    await this.articleService.updateArticleField(id, 'isFire', isFire, version);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: '更新文章状态' })
  @ApiOkResponse({ description: '更新成功' })
  @ApiConflictResponse({ description: '更新失败，文章版本不一致' })
  async updateArticleStatus(
    @Param('id') id: string,
    @Body() body: UpdateArticleStatusDtoReq
  ) {
    const { status, version } = body;
    await this.articleService.updateArticleField(id, 'status', status, version);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取文章详情' })
  @ApiOkResponse({ description: '获取文章详情成功' })
  @ApiJsonResultResponse(GetArticleResDto)
  async getArticleById(@Param('id') id: string) {
    return await this.articleService.getArticleWithTagsById(id);
  }
}
