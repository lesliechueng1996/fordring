import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AlbumService } from './album.service';
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
import { AUTHENTICATION } from 'src/constants/fordring.const';
import {
  ApiJsonResult,
  ApiJsonResultResponse,
} from 'src/dto/api-json-result.dto';
import { ALBUM_ERROR } from 'src/constants/error.const';
import { CreateAlbumReqDto } from './dto/create-album.dto';
import { AllAlbumsResDto } from './dto/all-albums.dto';
import { GetAlbumsResDto } from './dto/get-album.dto';
import { UpdateAlbumDtoReq } from './dto/update-album.dto';
import { PictureService } from '../picture/picture.service';
import { ConfigService } from '@nestjs/config';
import { AllPicturesResDto } from './dto/all-pictures.dto';

@Controller('album')
@ApiTags('Album')
@UseGuards(AuthGuard)
@ApiHeader({ name: AUTHENTICATION, description: 'token' })
@ApiExtraModels(ApiJsonResult)
@ApiBadRequestResponse({ description: '参数错误' })
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly pictureService: PictureService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @ApiOperation({ summary: '创建图册' })
  @ApiCreatedResponse({
    description: '创建图册成功',
  })
  @ApiConflictResponse({
    description: `code - ${ALBUM_ERROR.ALBUM_DISPLAY_NAME_ALREADY_EXIST}: 图册名称已存在, code - ${ALBUM_ERROR.ALBUM_FOLDER_NAME_ALREADY_EXIST}: 图册文件夹名称已存在}`,
  })
  async createAlbum(@Body() body: CreateAlbumReqDto) {
    await this.albumService.createAlbum(body);
  }

  @Get('all')
  @ApiOperation({ summary: '获取所有图册' })
  @ApiOkResponse({
    description: '获取所有图册成功',
  })
  @ApiJsonResultResponse(AllAlbumsResDto)
  async allAlbums(): Promise<AllAlbumsResDto> {
    const albums = await this.albumService.allAlbums();
    return {
      list: albums,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '根据id获取图册' })
  @ApiOkResponse({
    description: '根据id获取图册成功',
  })
  @ApiNotFoundResponse({
    description: '该图册不存在',
  })
  @ApiJsonResultResponse(GetAlbumsResDto)
  async getAlbum(@Param('id') id: number) {
    const album = await this.albumService.getAlbumById(id);
    return album;
  }

  @Patch(':id')
  @ApiOperation({ summary: '根据id更新图册' })
  @ApiOkResponse({
    description: '根据id更新图册成功',
  })
  @ApiNotFoundResponse({
    description: '该图册不存在',
  })
  @ApiConflictResponse({
    description: '图册版本冲突',
  })
  async updateAlbum(@Param('id') id: number, @Body() body: UpdateAlbumDtoReq) {
    await this.albumService.updateAlbumById(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '根据id删除图册' })
  @ApiOkResponse({
    description: '根据id删除图册成功',
  })
  @ApiConflictResponse({
    description: '图册内有图片, 无法删除',
  })
  async deleteAlbum(@Param('id') id: number) {
    await this.albumService.deleteAlbumById(id);
  }

  @Get(':id/pictures')
  @ApiOperation({ summary: '根据id获取图册内所有图片' })
  @ApiOkResponse({ description: '获取图册内所有图片成功' })
  @ApiJsonResultResponse(AllPicturesResDto)
  async allPictures(@Param('id') id: number): Promise<AllPicturesResDto> {
    const pictures = await this.pictureService.allPicturesByAlbumId(id);
    const urlPrefix = this.configService.get('QINIU_HOST');
    return {
      pictures: pictures.map((picture) => ({
        id: picture.id,
        name: picture.name,
        url: `${urlPrefix}${picture.storageKey}`,
        description: picture.description,
        createTime: picture.createTime.getTime(),
        version: picture.version,
      })),
    };
  }
}
