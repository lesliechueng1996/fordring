import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ALBUM_ERROR } from 'src/constants/error.const';
import { ApiJsonResult } from 'src/dto/api-json-result.dto';
import { Album } from 'src/entities/album.entity';
import { Repository } from 'typeorm';
import { CreateAlbumReqDto } from './dto/create-album.dto';
import { AllAlbumsResItem } from './dto/all-albums.dto';

@Injectable()
export class AlbumService {
  private readonly logger: Logger = new Logger(AlbumService.name);

  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
  ) {}

  async countByDisplayName(displayName: string) {
    return this.albumRepository.countBy({ displayName });
  }

  async countByFolderName(folderName: string) {
    return this.albumRepository.countBy({ folderName });
  }

  async isDisplayNameOrFolderNameExist(
    displayName: string,
    folderName: string,
  ) {
    const promise = Promise.all([
      this.countByDisplayName(displayName),
      this.countByFolderName(folderName),
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
      await this.albumRepository.insert({
        displayName,
        folderName,
        description,
        previewUrl,
      });
    } catch (e) {
      this.logger.error(e);
      throw ApiJsonResult.error(
        ALBUM_ERROR.ALBUM_CREATE_FAILED,
        'Create album failed',
      );
    }
  }

  async allAlbums() {
    const albums = await this.albumRepository.find();
    return albums.map((album) => new AllAlbumsResItem(album));
  }
}
