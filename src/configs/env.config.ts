import { ConfigModule } from '@nestjs/config';

const module = ConfigModule.forRoot({
  envFilePath: '.dev.env',
  isGlobal: true,
});

export default module;
