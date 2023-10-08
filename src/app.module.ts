import { Module } from '@nestjs/common';
import EnvConfigModule from './configs/env.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import DatabaseConfigModule from './configs/database.config';
import RedisConfigModule from './configs/redis-cache.config';

@Module({
  imports: [
    EnvConfigModule,
    DatabaseConfigModule,
    RedisConfigModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
