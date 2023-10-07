import { Module } from '@nestjs/common';
import EnvConfigModule from './configs/env.config';
import DatabaseConfigModule from './configs/database.config';

@Module({
  imports: [EnvConfigModule, DatabaseConfigModule],
})
export class AppModule {}
