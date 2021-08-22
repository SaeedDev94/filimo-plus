import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { WrapResponseInterceptor } from '../shared/wrap-response.interceptor';
import { DomService } from '../dom/dom.service';
import { IHome } from '../dom/dom.interface';
import { URL } from 'url';

@Controller('home')
export class HomeController {
  constructor(private domService: DomService) {}

  @Post('index')
  @UseInterceptors(WrapResponseInterceptor)
  async index(): Promise<IHome> {
    const html = await this.domService.getHtml('/');
    if (!this.domService.authenticated(html)) {
      throw new Error('Unauthorized');
    }
    return this.domService.home(html, true);
  }

  @Post('next')
  @UseInterceptors(WrapResponseInterceptor)
  async next(@Body('next') next: string): Promise<IHome> {
    const html = await this.domService.getHtml(new URL(next).pathname, true);
    return this.domService.home(html, false);
  }
}
