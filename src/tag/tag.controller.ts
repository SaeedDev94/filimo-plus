import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { DomService } from '../dom/dom.service';
import { WrapResponseInterceptor } from '../shared/wrap-response.interceptor';
import { ITag } from '../dom/dom.interface';
import { URL } from 'url';

@Controller('tag')
export class TagController {
  constructor(private domService: DomService) {}

  @Post('index')
  @UseInterceptors(WrapResponseInterceptor)
  async index(@Body('tag') slug: string): Promise<ITag> {
    const html = await this.domService.getHtml(`/tag/${slug}`);
    return this.domService.tag(html, true, slug);
  }

  @Post('next')
  @UseInterceptors(WrapResponseInterceptor)
  async next(@Body('next') next: string): Promise<ITag> {
    const html = await this.domService.getHtml(new URL(next).pathname, true);
    return this.domService.tag(html, false);
  }
}
