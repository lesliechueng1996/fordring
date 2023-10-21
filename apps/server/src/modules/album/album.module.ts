import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from 'src/entities/album.entity';
import { PictureModule } from '../picture/picture.module';

@Module({
  imports: [TypeOrmModule.forFeature([Album]), PictureModule],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
