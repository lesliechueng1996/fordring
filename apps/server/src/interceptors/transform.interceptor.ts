import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiJsonResult } from 'src/dto/api-json-result.dto';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiJsonResult<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ApiJsonResult<T>> {
    const statusCode = context
      .switchToHttp()
      .getResponse<Response>().statusCode;
    return next
      .handle()
      .pipe(map((data) => ApiJsonResult.success(data, statusCode)));
  }
}
