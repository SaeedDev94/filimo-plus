import { Injectable } from '@angular/core';

@Injectable()
export class StateService {

  constructor(
  ) {
  }

  loggedIn = !!localStorage.getItem('jwt_token');
}
