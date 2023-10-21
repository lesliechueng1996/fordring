import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiJsonResult } from 'src/dto/api-json-result.dto';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiJsonResult<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiJsonResult<T>> {
    return next.handle().pipe(map((data) => ApiJsonResult.success(data)));
  }
}
