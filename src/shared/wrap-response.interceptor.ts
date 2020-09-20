import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IBaseResponse } from '../app.interface';

@Injectable()
export class WrapResponseInterceptor<T> implements NestInterceptor<T, IBaseResponse<T>> {

  intercept(context: ExecutionContext, next: CallHandler): Observable<IBaseResponse<T>> {
    return next.handle()
      .pipe(
        map((response) => {
          return {
            status: 200,
            success: !!response,
            message: response ? 'OK' : 'Failed',
            data: response
          } as IBaseResponse<T>;
        })
      );
  }
}
