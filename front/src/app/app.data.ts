import { Injectable } from '@angular/core';
import { IHome, IMovie, ITag, IUser } from './app.interface';
import { Log } from './shared/helper/log.helper';
import { environment } from '../environments/environment';

@Injectable()
export class AppData {

  constructor() {
    Log.i('AppData init');
    this.invalidateCache();
  }

  private initTS: number;
  data: {
    user: IUser;
    home: IHome;
    tag: ITag[];
    movie: IMovie[];
  };

  private setData(): void {
    this.data = {
      user: undefined,
      home: undefined,
      tag: [],
      movie: []
    };
  }

  invalidateCache(): void {
    this.initTS = new Date().valueOf();
    this.setData();
  }

  get<T>(key: string): T {
    const currentTS = new Date().valueOf();
    const cacheUsedTime = currentTS - this.initTS;
    if (cacheUsedTime >= environment.cacheExpireTime) {
      this.invalidateCache();
    }
    return this.data[key] as T;
  }
}
