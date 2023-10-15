import { Controller, Get, UseGuards } from '@nestjs/common';
import { PictureService } from './picture.service';
import { QiniuService } from 'src/providers/QiniuService';
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
  ) {}

  @Get('simple-upload-token')
  @ApiOkResponse({ description: '获取成功', type: String })
  getSimpleUploadToken() {
    const token = this.qiniuService.simpleUploadToken();
    return token;
  }
}
