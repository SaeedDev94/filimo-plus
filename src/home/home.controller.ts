import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { WrapResponseInterceptor } from '../shared/wrap-response.interceptor';

@Controller('home')
export class HomeController {
  @Post('index')
  @UseInterceptors(WrapResponseInterceptor)
  index() {
    return 'Test';
  }
}
