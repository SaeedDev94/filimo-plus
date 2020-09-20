import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ILoginRequest, ILoginRequestPayload, ILoginVerify, ILoginVerifyPayload } from './auth.interface';
import { AuthService } from './auth.service';
import { WrapResponseInterceptor } from '../shared/wrap-response.interceptor';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) {
  }

  @Post('step/one')
  @UseInterceptors(WrapResponseInterceptor)
  stepOne(@Body() payload: ILoginRequestPayload): Promise<ILoginRequest> {
    return this.authService.request(payload);
  }

  @Post('step/two')
  @UseInterceptors(WrapResponseInterceptor)
  stepTwo(@Body() payload: ILoginVerifyPayload): Promise<ILoginVerify> {
    return this.authService.verify(payload);
  }

  @Post('logout')
  @UseInterceptors(WrapResponseInterceptor)
  logout(): Promise<boolean> {
    return this.authService.logout();
  }
}
