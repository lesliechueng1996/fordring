import { DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Fordring API')
  .setDescription('The Fordring Blog Server API')
  .setVersion('1.0')
  .addServer('/api')
  .build();

export default config;
