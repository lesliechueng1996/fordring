import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';

const cacheModule = CacheModule.registerAsync<RedisClientOptions>({
  isGlobal: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    store: await redisStore({
      socket: {
        host: configService.get('REDIS_HOST'),
        port: +configService.get('REDIS_PORT'),
      },
      database: +configService.get('REDIS_DB'),
      ttl: +configService.get('REDIS_TTL'),
    }),
  }),
});

export default cacheModule;
