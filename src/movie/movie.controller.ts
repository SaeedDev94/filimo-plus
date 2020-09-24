import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { DomService } from '../dom/dom.service';
import { WrapResponseInterceptor } from '../shared/wrap-response.interceptor';
import { IMovie } from '../dom/dom.interface';

@Controller('movie')
export class MovieController {

  constructor(
    private domService: DomService
  ) {
  }

  @Post('index')
  @UseInterceptors(WrapResponseInterceptor)
  async index(@Body('id') slug: string): Promise<IMovie> {
    const html = await this.domService.getHtml(`/m/${slug}`);
    const movie: IMovie = this.domService.movie(html);
    if (movie.id && movie.id !== 'w') {
      if (movie.id !== slug) {
        movie.slug = slug;
      }
      movie.download = null;
    }
    return movie;
  }
}
