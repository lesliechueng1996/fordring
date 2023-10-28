import { Module } from '@nestjs/common';
import { PictureService } from './picture.service';
import { PictureController } from './picture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Picture } from 'src/entities';
import { QiniuService } from 'src/providers/QiniuService';

@Module({
  imports: [TypeOrmModule.forFeature([Picture])],
  controllers: [PictureController],
  providers: [PictureService, QiniuService],
  exports: [PictureService],
})
export class PictureModule {}
