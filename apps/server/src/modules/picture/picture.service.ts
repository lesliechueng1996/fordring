import { Injectable } from '@nestjs/common';
import { CreatePictureReqDto } from './dto/create-picture.dto';
import { QiniuService } from 'src/providers/qiniu.service';
import { PictureRepository } from 'src/repositories/picture.repository';

@Injectable()
export class PictureService {
  constructor(
    private pictureRepository: PictureRepository,
    private readonly qiniuService: QiniuService,
  ) {}

  async countByAlbumId(albumId: number) {
    return this.pictureRepository.countByAlbumId(albumId);
  }

  async savePicture(dto: CreatePictureReqDto) {
    const { albumId, name, description, storageKey } = dto;

    return this.pictureRepository.save({
      album: {
        connect: {
          id: albumId,
        },
      },
      name,
      description,
      storageKey,
      // FIXME in the future, we should add folder support
      url: storageKey,
    });
  }

  async allPicturesByAlbumId(albumId: number) {
    return this.pictureRepository.findByAlbumId(albumId);
  }

  async deletePicture(id: number) {
    const picture = await this.pictureRepository.findById(id);
    if (picture) {
      await this.qiniuService.deleteFile(picture.storageKey);
      await this.pictureRepository.deleteById(id);
    }
  }
}
