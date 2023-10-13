import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AlbumService } from './album.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiHeader,
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

@Controller('album')
@ApiTags('Album')
@UseGuards(AuthGuard)
@ApiHeader({ name: AUTHENTICATION, description: 'token' })
@ApiExtraModels(ApiJsonResult)
@ApiBadRequestResponse({ description: '参数错误' })
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @ApiOperation({ summary: '创建图册' })
  @ApiCreatedResponse({
    description: '创建图册成功',
  })
  @ApiConflictResponse({
    description: `code - ${ALBUM_ERROR.ALBUM_DISPLAY_NAME_ALREADY_EXIST}: 图册名称已存在, code - ${ALBUM_ERROR.ALBUM_FOLDER_NAME_ALREADY_EXIST}: 图册文件夹名称已存在}`,
  })
  async createAlbum(@Body() body: CreateAlbumReqDto) {
    this.albumService.createAlbum(body);
  }

  @Get('all')
  @ApiOperation({ summary: '获取所有图册' })
  @ApiCreatedResponse({
    description: '获取所有图册成功',
  })
  @ApiJsonResultResponse(AllAlbumsResDto)
  async allAlbums(): Promise<AllAlbumsResDto> {
    const albums = await this.albumService.allAlbums();
    return {
      list: albums,
    };
  }
}
