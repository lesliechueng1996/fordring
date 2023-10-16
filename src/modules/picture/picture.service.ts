import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Picture } from 'src/entities/picture.entity';
import { Repository } from 'typeorm';
import { CreatePictureReqDto } from './dto/create-picture.dto';
import { QiniuService } from 'src/providers/QiniuService';

@Injectable()
export class PictureService {
  constructor(
    @InjectRepository(Picture)
    private pictureRepository: Repository<Picture>,
    private readonly qiniuService: QiniuService,
  ) {}

  async countByAlbumId(albumId: number) {
    return this.pictureRepository.countBy({ albumId });
  }

  async savePicture(dto: CreatePictureReqDto) {
    const { albumId, name, description, storageKey } = dto;
    const picture = new Picture();
    picture.albumId = albumId;
    picture.name = name;
    picture.description = description;
    picture.storageKey = storageKey;
    // FIXME in the future, we should add folder support
    picture.url = storageKey;

    return this.pictureRepository.insert(picture);
  }

  async allPicturesByAlbumId(albumId: number) {
    return this.pictureRepository.findBy({ albumId });
  }

  async deletePicture(id: number) {
    const picture = await this.pictureRepository.findOneBy({ id });
    if (picture) {
      await this.qiniuService.deleteFile(picture.storageKey);
      await this.pictureRepository.delete(id);
    }
  }
}
