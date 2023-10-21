import { ConfigModule } from '@nestjs/config';

const configModule = ConfigModule.forRoot({
  envFilePath: '.env.local',
  isGlobal: true,
});

export default configModule;
