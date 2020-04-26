import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FullscreenLoadingService } from '../fullscreen-loading.service';

@Injectable()
export class FullscreenLoadingInterceptor implements HttpInterceptor {

  constructor(
    private fullscreenLoadingService: FullscreenLoadingService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      finalize(() => this.fullscreenLoadingService.hide())
    );
  }
}
