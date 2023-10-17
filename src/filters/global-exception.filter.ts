import { HttpAdapterHost } from '@nestjs/core';
import {
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { ApiJsonResult } from 'src/dto/api-json-result.dto';
import { INTERNAL_SERVER_ERROR } from 'src/constants/error.const';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    this.logger.error(exception);

    if (exception instanceof HttpException) {
      httpAdapter.reply(
        response,
        exception.getResponse(),
        exception.getStatus(),
      );
      return;
    }

    if (exception instanceof ApiJsonResult) {
      httpAdapter.reply(response, exception, HttpStatus.INTERNAL_SERVER_ERROR);
      return;
    }

    httpAdapter.reply(
      response,
      ApiJsonResult.error(INTERNAL_SERVER_ERROR, '系统异常'),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
