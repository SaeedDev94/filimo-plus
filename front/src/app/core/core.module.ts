import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './guard/auth.guard';
import { LoginGuard } from './guard/login.guard';
import { StateService } from './state.service';
import { JwtTokenInterceptor } from './interceptor/jwt-token.interceptor';
import { FullscreenLoadingInterceptor } from './interceptor/fullscreen-loading.interceptor';
import { BodyScrollService } from './body-scroll.service';
import { FullscreenLoadingService } from './fullscreen-loading.service';
import { SnackbarService } from './snackbar.service';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    AuthGuard,
    LoginGuard,
    //
    AuthService,
    StateService,
    //
    BodyScrollService,
    FullscreenLoadingService,
    SnackbarService,
    //
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtTokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FullscreenLoadingInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {}
