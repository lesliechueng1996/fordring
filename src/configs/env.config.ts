import { ConfigModule } from '@nestjs/config';

const configModule = ConfigModule.forRoot({
  envFilePath: '.dev.env',
  isGlobal: true,
});

export default configModule;
