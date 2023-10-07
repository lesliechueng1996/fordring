import { ConfigModule } from '@nestjs/config';

export default ConfigModule.forRoot({
  envFilePath: '.dev.env',
  isGlobal: true,
});
