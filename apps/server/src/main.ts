import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import WinstonLogger from './configs/logger.config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import SwaggerConfig from './configs/swagger.config';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonLogger,
    cors: true,
  });

  // global exception filter
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));

  // global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // swagger
  if (process.env.NODE_ENV === 'development') {
    const document = SwaggerModule.createDocument(app, SwaggerConfig);
    SwaggerModule.setup('swagger', app, document);
  }

  // interceptors
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new LoggingInterceptor()
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
