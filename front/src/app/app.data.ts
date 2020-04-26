import { Injectable } from '@angular/core';
import { IHome, IMovie, ITag, IUser } from './app.interface';

@Injectable()
export class AppData {

  constructor(
  ) {
  }

  user: IUser;
  home: IHome;
  tag: ITag[] = [];
  movie: IMovie[] = [];
}
