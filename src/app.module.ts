import { Module } from '@nestjs/common';
import EnvConfigModule from './configs/env.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import DatabaseConfigModule from './configs/database.config';

@Module({
  imports: [EnvConfigModule, DatabaseConfigModule, AuthModule, UserModule],
})
export class AppModule {}
