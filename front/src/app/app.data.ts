import { Injectable } from '@angular/core';
import { IHome, IMovie, ITag, IUser } from './app.interface';
import { Log } from './shared/helper/log.helper';

@Injectable()
export class AppData {

  constructor() {
    Log.i('AppData init');
    this.invalidateCache();
  }

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
    this.setData();
  }
}
