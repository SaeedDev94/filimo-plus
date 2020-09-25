import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { SearchService } from './search.service';
import { ISearch } from './search.interface';
import { WrapResponseInterceptor } from '../shared/wrap-response.interceptor';

@Controller('search')
export class SearchController {

  constructor(
    private searchService: SearchService
  ) {
  }

  @Post('index')
  @UseInterceptors(WrapResponseInterceptor)
  index(@Body('path') path: string): Promise<ISearch[]> {
    return this.searchService.get(path);
  }
}
