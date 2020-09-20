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
  @UseInterceptors(new WrapResponseInterceptor<ILoginRequest>())
  stepOne(@Body() payload: ILoginRequestPayload): Promise<ILoginRequest> {
    return this.authService.request(payload);
  }

  @Post('step/two')
  @UseInterceptors(new WrapResponseInterceptor<ILoginVerify>())
  stepTwo(@Body() payload: ILoginVerifyPayload): Promise<ILoginVerify> {
    return this.authService.verify(payload);
  }

  @Post('logout')
  @UseInterceptors(new WrapResponseInterceptor<boolean>())
  logout(): Promise<boolean> {
    return this.authService.logout();
  }
}
