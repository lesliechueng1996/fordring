import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AUTHENTICATION, USER_ID_KEY } from 'src/constants/fordring.const';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const className = context.getClass().name;
    const methodName = context.getHandler().name;
    const request = context.switchToHttp().getRequest<Request>();
    const { path, method, body, query, params } = request;

    this.logger.log(`
------------------------------------------------------
  Start to handle ${className}.${methodName}
  Url: ${path}
  Method: ${method}
  Authentication: ${request.get(AUTHENTICATION)}
  UserId: ${request[USER_ID_KEY]}
  Params: ${JSON.stringify(params)}
  Query: ${JSON.stringify(query)}
  Request Body: ${JSON.stringify(body)} 
------------------------------------------------------
    `);

    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.logger.log(`
++++++++++++++++++++++++++++++++++++++++++++++++++++++
  Url: ${path}
  Method: ${method}
  Response Body: ${JSON.stringify(data)}
  Finished ${className}.${methodName} in ${Date.now() - now}ms
++++++++++++++++++++++++++++++++++++++++++++++++++++++
          `);
        },
        error: (error) => {
          this.logger.error(`
======================================================
  Url: ${path}
  Method: ${method}
  Error: ${error}
  Error Finished ${className}.${methodName} in ${Date.now() - now}ms
======================================================
          `);
        },
      })
    );
  }
}
