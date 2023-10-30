import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ALBUM_ERROR } from 'src/constants/error.const';
import { ApiJsonResult } from 'src/dto/api-json-result.dto';
import { CreateAlbumReqDto } from './dto/create-album.dto';
import { GetAlbumResDto } from './dto/get-album.dto';
import { UpdateAlbumDtoReq } from './dto/update-album.dto';
import { PictureService } from '../picture/picture.service';
import { AlbumRepository } from 'src/repositories/album.repository';
import { Prisma } from '@prisma/client';
import { PRISMA_ERROR } from 'src/constants/fordring.const';

@Injectable()
export class AlbumService {
  private readonly logger: Logger = new Logger(AlbumService.name);

  constructor(
    private albumRepository: AlbumRepository,
    private pictureService: PictureService,
  ) {}

  async countByDisplayName(displayName: string, excludeId?: number) {
    const where: Prisma.AlbumWhereInput = {
      displayName,
    };
    if (excludeId) {
      where.id = {
        not: excludeId,
      };
    }

    return this.albumRepository.count(where);
  }

  async countByFolderName(folderName: string, excludeId?: number) {
    const where: Prisma.AlbumWhereInput = {
      folderName,
    };
    if (excludeId) {
      where.id = {
        not: excludeId,
      };
    }

    return this.albumRepository.count(where);
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
    const albums = await this.albumRepository.getAlbumPrisma().findMany({
      include: {
        _count: {
          select: {
            pictures: true,
          },
        },
      },
    });

    return albums.map((album) => {
      const {
        _count: { pictures },
      } = album;
      return new GetAlbumResDto(album, pictures);
    });
  }

  async getAlbumById(id: number) {
    const album = await this.albumRepository.findById(id);
    const pictureCount = await this.pictureService.countByAlbumId(id);
    if (!album) {
      this.logger.error(`album id: ${id} not found`);
      throw new NotFoundException(
        ApiJsonResult.error(ALBUM_ERROR.ALBUM_NOT_FOUND, 'Album not found'),
      );
    }
    return new GetAlbumResDto(album, pictureCount);
  }

  async updateAlbumById(id: number, dto: UpdateAlbumDtoReq) {
    const { displayName, folderName, description, previewUrl, version } = dto;
    await this.isDisplayNameOrFolderNameExist(displayName, folderName, id);
    try {
      await this.albumRepository.updateById(
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

      if (e.code === PRISMA_ERROR.NOT_FOUNT) {
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

      throw ApiJsonResult.error(
        ALBUM_ERROR.UPDATE_ALBUM_FAILED,
        'Update album failed',
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
    await this.albumRepository.deleteById(id);
  }

  async albumToOptions() {
    const albums = await this.albumRepository.findAllOrderByCreateTimeDesc();
    return albums.map((album) => ({
      label: album.displayName,
      value: String(album.id),
    }));
  }
}
