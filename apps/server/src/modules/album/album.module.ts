import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { PictureModule } from '../picture/picture.module';

@Module({
  imports: [PictureModule],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
