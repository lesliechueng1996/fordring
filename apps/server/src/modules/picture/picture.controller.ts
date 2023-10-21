import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PictureService } from './picture.service';
import {
  QiniuService,
  UPLOAD_TOKEN_EXPIRE_SECONDS,
} from 'src/providers/QiniuService';
import { AuthGuard } from 'src/guards/AuthGuard';
import {
  ApiBadRequestResponse,
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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  CreatePictureReqDto,
  CreatePictureResDto,
} from './dto/create-picture.dto';

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
  @ApiOperation({ summary: '获取简单上传凭证' })
  @ApiOkResponse({ description: '获取成功', type: String })
  async getSimpleUploadToken() {
    const cachedToken = await this.cacheManger.get(UPLOAD_TOKEN_CACHE_KEY);
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

  @Post()
  @ApiOperation({ summary: '保存图片' })
  @ApiCreatedResponse({ description: '保存图片成功' })
  @ApiJsonResultResponse(CreatePictureResDto)
  async createPicture(@Body() body: CreatePictureReqDto) {
    const picture = await this.pictureService.savePicture(body);
    return {
      id: picture.id,
      url: picture.url,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除图片' })
  @ApiOkResponse({ description: '删除图片成功' })
  async deletePicture(@Param('id') id: number) {
    await this.pictureService.deletePicture(id);
  }
}
