import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { IBaseResponse } from '../app.interface';
import { Response } from 'express';
import { map } from 'rxjs/operators';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IBaseResponse> {
    const response = context.switchToHttp().getResponse<Response>();
    response.status(200);
    return next.handle().pipe(
      map((response) => {
        return {
          success: true,
          message: 'OK',
          data: response,
        } as IBaseResponse;
      }),
    );
  }
}
