import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { PictureService } from './picture.service';
import {
  QiniuService,
  UPLOAD_TOKEN_EXPIRE_SECONDS,
} from 'src/providers/QiniuService';
import { AuthGuard } from 'src/guards/AuthGuard';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AUTHENTICATION } from 'src/constants/fordring.const';
import { ApiJsonResult } from 'src/dto/api-json-result.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const UPLOAD_TOKEN_CACHE_KEY = 'UPLOAD_TOKEN_CACHE_KEY';

@Controller('picture')
@UseGuards(AuthGuard)
@ApiTags('Picture')
@ApiHeader({ name: AUTHENTICATION, description: 'token' })
@ApiExtraModels(ApiJsonResult)
@ApiBadRequestResponse({ description: '参数错误' })
export class PictureController {
  constructor(
    private readonly pictureService: PictureService,
    private readonly qiniuService: QiniuService,
    @Inject(CACHE_MANAGER) private cacheManger: Cache,
  ) {}

  @Get('simple-upload-token')
  @ApiOkResponse({ description: '获取成功', type: String })
  getSimpleUploadToken() {
    const cachedToken = this.cacheManger.get(UPLOAD_TOKEN_CACHE_KEY);
    if (cachedToken) {
      return cachedToken;
    }

    const token = this.qiniuService.simpleUploadToken();
    this.cacheManger.set(
      UPLOAD_TOKEN_CACHE_KEY,
      token,
      UPLOAD_TOKEN_EXPIRE_SECONDS * 1000,
    );
    return token;
  }
}
