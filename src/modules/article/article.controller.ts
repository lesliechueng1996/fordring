import { Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/AuthGuard';
import { AUTHENTICATION } from 'src/constants/fordring.const';
import { ApiJsonResult } from 'src/dto/api-json-result.dto';

@Controller('article')
@ApiTags('Article')
@UseGuards(AuthGuard)
@ApiHeader({ name: AUTHENTICATION, description: 'token' })
@ApiExtraModels(ApiJsonResult)
@ApiBadRequestResponse({ description: '参数错误' })
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('/draft')
  async saveDraft() {}

  @Patch('/draft/:id')
  async updateDraft(@Param('id') id: string) {
    console.log(id);
  }
}
