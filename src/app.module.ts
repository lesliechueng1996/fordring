import { Module } from '@nestjs/common';
import EnvConfigModule from './configs/env.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { AlbumModule } from './modules/album/album.module';
import { PictureModule } from './modules/picture/picture.module';
import { TagModule } from './modules/tag/tag.module';
import { ArticleModule } from './modules/article/article.module';
import DatabaseConfigModule from './configs/database.config';
import RedisConfigModule from './configs/redis-cache.config';
import JwtModule from './configs/jwt.config';

@Module({
  imports: [
    EnvConfigModule,
    DatabaseConfigModule,
    RedisConfigModule,
    JwtModule,
    AuthModule,
    UserModule,
    CategoryModule,
    AlbumModule,
    PictureModule,
    TagModule,
    ArticleModule,
  ],
})
export class AppModule {}
