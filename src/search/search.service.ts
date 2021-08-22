import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';
import { ISearch } from './search.interface';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SearchService {
  constructor(private http: HttpService, private config: ConfigService) {}

  get(path: string): Promise<ISearch[]> {
    return this.http
      .get<any>(path, {
        baseURL: this.config.get('url.filimo'),
      })
      .pipe(
        map((response) => {
          return response.data?.included?.map((item) => {
            return {
              id: item.attributes?.link_key || '',
              image: item.attributes?.pic?.movie_img_m || '',
              title: item.attributes?.movie_title || '',
              description: item.attributes?.descr || '',
            } as ISearch;
          });
        }),
      )
      .toPromise();
  }
}
