import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiHeader,
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

@Controller('article')
@ApiTags('Article')
@UseGuards(AuthGuard)
@ApiHeader({ name: AUTHENTICATION, description: 'token' })
@ApiExtraModels(ApiJsonResult)
@ApiBadRequestResponse({ description: '参数错误' })
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
  ) {}

  @Post('/draft')
  @ApiOperation({ summary: '保存草稿' })
  @ApiCreatedResponse({ description: '保存成功' })
  @ApiJsonResultResponse(SaveDraftDtoRes)
  async saveDraft(
    @Body() body: SaveDraftDtoReq,
    @Req() req: Request,
  ): Promise<SaveDraftDtoRes> {
    const userId: string = req[USER_ID_KEY];
    const { title, content } = body;
    const user = await this.userService.getUserById(userId);
    const article = await this.articleService.saveDraftArticle(
      title,
      content,
      user,
    );
    return {
      id: article.id,
    };
  }

  @Patch('/draft/:id')
  async updateDraft(@Param('id') id: string) {
    console.log(id);
  }
}
