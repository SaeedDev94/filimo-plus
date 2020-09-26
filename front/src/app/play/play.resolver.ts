import { Injectable } from '@angular/core';
import { AppData } from '../app.data';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { IBaseResponse, IMovie, IPlay } from '../app.interface';
import { PlayService } from './play.service';

@Injectable()
export class PlayResolver implements Resolve<IPlay> {

  constructor(
    private appData: AppData,
    private playService: PlayService
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot
  ): Promise<IPlay> {
    return new Promise<IPlay>(async (resolve, reject) => {
      const id = route.paramMap.get('id') || '';
      const type = route.paramMap.get('type') || '';
      const movie = this.appData.get<IMovie[]>('movie').find(i => i.id === id);
      const handleResponse = (res: IBaseResponse<IPlay>) => {
        if (res && res.success) {
          resolve(res.data);
        } else {
          reject();
        }
      };
      let response: IBaseResponse<IPlay>;
      if (type === 'hls') {
        try {
          response = await this.playService.hls({
            id,
            download: (movie) ? movie.download : null
          });
        } finally {
          handleResponse(response);
        }
      } else if (type === 'file') {
        try {
          response = await this.playService.file(id);
        } finally {
          handleResponse(response);
        }
      } else {
        reject();
      }
    });
  }
}
