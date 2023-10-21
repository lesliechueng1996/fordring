import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ALBUM_ERROR } from 'src/constants/error.const';
import { ApiJsonResult } from 'src/dto/api-json-result.dto';
import { Album } from 'src/entities/album.entity';
import { Not, Repository, UpdateResult } from 'typeorm';
import { CreateAlbumReqDto } from './dto/create-album.dto';
import { GetAlbumsResDto } from './dto/get-album.dto';
import { UpdateAlbumDtoReq } from './dto/update-album.dto';
import { PictureService } from '../picture/picture.service';

type AlbumWithPictureCount = Album & { pictureCount: number };

@Injectable()
export class AlbumService {
  private readonly logger: Logger = new Logger(AlbumService.name);

  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    private pictureService: PictureService,
  ) {}

  async countByDisplayName(displayName: string, excludeId?: number) {
    const where = {
      displayName,
    };
    if (excludeId) {
      where['id'] = Not(excludeId);
    }

    return this.albumRepository.count({
      where,
    });
  }

  async countByFolderName(folderName: string, excludeId?: number) {
    const where = {
      folderName,
    };
    if (excludeId) {
      where['id'] = Not(excludeId);
    }

    return this.albumRepository.countBy(where);
  }

  async isDisplayNameOrFolderNameExist(
    displayName: string,
    folderName: string,
    excludeId?: number,
  ) {
    const promise = Promise.all([
      this.countByDisplayName(displayName, excludeId),
      this.countByFolderName(folderName, excludeId),
    ]);

    const [displayNameCount, folderNameCount] = await promise;

    if (displayNameCount > 0) {
      this.logger.error(`displayName: ${displayName} already exist`);
      throw new ConflictException(
        ApiJsonResult.error(
          ALBUM_ERROR.ALBUM_DISPLAY_NAME_ALREADY_EXIST,
          'Album display name already exist',
        ),
      );
    }

    if (folderNameCount > 0) {
      this.logger.error(`folderName: ${folderName} already exist`);
      throw new ConflictException(
        ApiJsonResult.error(
          ALBUM_ERROR.ALBUM_FOLDER_NAME_ALREADY_EXIST,
          'Album folder name already exist',
        ),
      );
    }
  }

  async createAlbum(dto: CreateAlbumReqDto) {
    const { displayName, folderName, description, previewUrl } = dto;
    await this.isDisplayNameOrFolderNameExist(displayName, folderName);

    try {
      const album = await this.albumRepository.save({
        displayName,
        folderName,
        description,
        previewUrl,
      });
      return album;
    } catch (e) {
      this.logger.error(e);
      throw ApiJsonResult.error(
        ALBUM_ERROR.ALBUM_CREATE_FAILED,
        'Create album failed',
      );
    }
  }

  async allAlbums() {
    const result: AlbumWithPictureCount[] = await this.albumRepository.query(`
      select 
        album.id as "id",
        album.display_name as "displayName",
        album.folder_name as "folderName",
        album.description as "description",
        album.preview_url as "previewUrl",
        album.version as "version",
        album.create_time as "createTime",
        album.update_time as "updateTime",
        t1.picture_count as "pictureCount"
      from t_album as album 
      left join (
        select album_id, count(*) as picture_count from t_picture group by album_id
      ) t1 on album.id = t1.album_id
    `);

    return result.map(
      (album) => new GetAlbumsResDto(album, album.pictureCount),
    );
  }

  async getAlbumById(id: number) {
    const album = await this.albumRepository.findOneBy({ id });
    const pictureCount = await this.pictureService.countByAlbumId(id);
    if (!album) {
      this.logger.error(`album id: ${id} not found`);
      throw new NotFoundException(
        ApiJsonResult.error(ALBUM_ERROR.ALBUM_NOT_FOUND, 'Album not found'),
      );
    }
    return new GetAlbumsResDto(album, pictureCount);
  }

  async updateAlbumById(id: number, dto: UpdateAlbumDtoReq) {
    const { displayName, folderName, description, previewUrl, version } = dto;
    await this.isDisplayNameOrFolderNameExist(displayName, folderName, id);
    let result: UpdateResult;

    try {
      result = await this.albumRepository.update(
        {
          id,
          version,
        },
        {
          displayName,
          folderName,
          description,
          previewUrl,
        },
      );
    } catch (e) {
      this.logger.error(e);
      throw ApiJsonResult.error(
        ALBUM_ERROR.UPDATE_ALBUM_FAILED,
        'Update album failed',
      );
    }

    if (result.affected === 0) {
      this.logger.error(
        `album ${id} not found or version ${version} not match`,
      );
      throw new ConflictException(
        ApiJsonResult.error(
          ALBUM_ERROR.ALBUM_VERSION_CONFLICT,
          'Album not found or version not match',
        ),
      );
    }
  }

  async deleteAlbumById(id: number) {
    const pictureCount = await this.pictureService.countByAlbumId(id);
    if (pictureCount > 0) {
      this.logger.error(`album id: ${id} has picture`);
      throw new ConflictException(
        ApiJsonResult.error(ALBUM_ERROR.ALBUM_HAS_PICTURE, 'Album has picture'),
      );
    }
    await this.albumRepository.delete({ id });
  }

  async albumToOptions() {
    const albums = await this.albumRepository.find({
      order: {
        createTime: 'DESC',
      },
    });
    return albums.map((album) => ({
      label: album.displayName,
      value: String(album.id),
    }));
  }
}
